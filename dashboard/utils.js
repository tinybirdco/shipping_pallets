// auxiliary function to retrieve the data from tinybird and update the state
export const fetchTinybirdUrl = async (fetchUrl, setState) => {
  // console.log(fetchUrl);
  const data = await fetch(fetchUrl);
  const jsonData = await data.json();
  setState(jsonData.data);
};

// auxiliary function to retrieve the data from tinybird, parse it to the desired Tremor (i.e., making the "pivot" from [{"date":"2023-01-02", "dim":"a", "value": 3}, {"date":"2023-01-02", "dim":"b", "value": 5}] to [{{"date":"2023-01-02", "a": 3, "b": 5}}]) and update the state.
export const fetchTinybirdUrlToTremorChart = async (fetchUrl, setState, xAxis, categ, count) => {
  const data = await fetch(fetchUrl)
  const jsonData = await data.json();
  const result = await jsonData.data.reduce((acc, cur) => {
    const key = cur[xAxis];
    const secondKey = cur[categ]
    if (acc[key]) {
      if (acc[key][secondKey]) {
        acc[key][secondKey] += cur[count];
      } else {
        acc[key][secondKey] = cur[count];
      }
    } else {
      acc[key] = { [secondKey]: cur[count] };
    }
    return acc;
  }, {});

  // console.log(result)

  const parsedResult = Object.entries(result).map(([a, data]) => ({
    [xAxis]: a,
    ...data
  }));

  setState(parsedResult);
};

export const getCategories = (arr, exclude) => {
  let res = Array.from(new Set(arr.reduce((acc, obj) => { return acc.concat(Object.keys(obj)); }, [])).values())
  const index = res.indexOf(exclude);
  if (index > -1) {
    res.splice(index, 1);
  }
  return res;
}
