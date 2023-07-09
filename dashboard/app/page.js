"use client";

import { BarChart, AreaChart, DonutChart, Title, Col, Card, Grid, Flex, Metric, ProgressBar, Text, DateRangePicker, MultiSelect, TextInput, MultiSelectItem, Select, SelectItem, Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell, TabGroup, TabList, Tab, TabPanels, TabPanel } from "@tremor/react";
import { useState, useEffect } from "react";
import useInterval from '../hooks/useInterval';
import { fetchTinybirdUrl, fetchTinybirdUrlToTremorChart, getCategories } from "../utils";
import {
  RefreshIcon, StopIcon, UserGroupIcon, UserIcon, ArchiveIcon, TableIcon, ClockIcon, ClipboardCheckIcon, CurrencyDollarIcon
} from "@heroicons/react/outline";
import Head from "next/head";


const TINYBIRD_HOST = process.env.NEXT_PUBLIC_TINYBIRD_HOST;
const TINYBIRD_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN;

const MS_REFRESH = 20000;


export default function Dashboard() {
  let msRefresh = MS_REFRESH;

  const [token, setToken] = useState(TINYBIRD_TOKEN);

  const now = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000);

  const [dates, setDates] = useState({
    from: new Date(2023, 5, 1),
    to: new Date()
  }
  );

  const [quickRefresh, setQuickRefresh] = useState(
    false
  );

  const [kpiShipments, setKpiShipments] = useState([{ customer_name: '', total_shipments: 0 }]);
  const [kpiSpent, setKpiSpent] = useState([{ customer_name: '', total_spent: 0 }]);
  const [chartShipments, setChartShipments] = useState([{ customer_name: '', t: '', total_shipments: 0 }]);
  const [chartOnTimePickups, setChartOnTimePickups] = useState([{ customer_name: '', t: '', on_time_pick_ups: 2, delayed_pick_ups: 1 }]);




  let date_from = dates.from ? new Date(dates.from.getTime() - dates.from.getTimezoneOffset() * 60000).toISOString() : new Date(2023, 5, 1).toISOString();
  let date_to = dates.to ? new Date(dates.to.getTime() - dates.to.getTimezoneOffset() * 60000 + 60000 * 60 * 24 - 1).toISOString() : date_from;

  let apiKpiShipments = `https://${TINYBIRD_HOST}/v0/pipes/api_kpis.json?kpi=shipments&token=${token}${date_from ? `&date_from=${date_from}` : ''}${date_to ? `&date_to=${date_to}` : ''}`;
  let apiKpiSpent = `https://${TINYBIRD_HOST}/v0/pipes/api_kpis.json?kpi=spent&token=${token}${date_from ? `&date_from=${date_from}` : ''}${date_to ? `&date_to=${date_to}` : ''}`;

  let apiChartShipments = `https://${TINYBIRD_HOST}/v0/pipes/api_charts.json?kpi=shipments&token=${token}${date_from ? `&date_from=${date_from}` : ''}${date_to ? `&date_to=${date_to}` : ''}`;
  let apiChartOnTimePickups = `https://${TINYBIRD_HOST}/v0/pipes/api_charts.json?kpi=on_time_pickups&token=${token}${date_from ? `&date_from=${date_from}` : ''}${date_to ? `&date_to=${date_to}` : ''}`;


  // quickRefresh ?
  //   useInterval(() => {
  //     fetchTinybirdUrl(apiAccessMethods, setAccessMethods);
  //   }, msRefresh)
  //   :
  //   useInterval(() => {
  //     fetchTinybirdUrl(apiAccessMethods, setAccessMethods);
  //   }, msRefresh * 10000)


  useInterval(() => {
    fetchTinybirdUrl(apiKpiShipments, setKpiShipments);
  }, msRefresh)

  useEffect(() => {
    fetchTinybirdUrl(apiKpiShipments, setKpiShipments);
  }, [apiKpiShipments]);

  useInterval(() => {
    fetchTinybirdUrl(apiKpiSpent, setKpiSpent);
  }, msRefresh)

  useEffect(() => {
    fetchTinybirdUrl(apiKpiSpent, setKpiSpent);
  }, [apiKpiSpent]);

  useInterval(() => {
    fetchTinybirdUrl(apiChartShipments, setChartShipments);
  }, msRefresh)

  useEffect(() => {
    fetchTinybirdUrl(apiChartShipments, setChartShipments);
  }, [apiChartShipments]);

  useInterval(() => {
    fetchTinybirdUrl(apiChartOnTimePickups, setChartOnTimePickups);
  }, msRefresh)

  useEffect(() => {
    fetchTinybirdUrl(apiChartOnTimePickups, setChartOnTimePickups);
  }, [apiChartOnTimePickups]);


  const validateInputToken = async (inputValue) => {
    const response = await fetch(`https://${TINYBIRD_HOST}/v0/pipes?token=${inputValue}`);
    // console.log(response.status)
    return response.status === 200;
  };


  const handleInputTokenChange = async (event) => {
    const newToken = event.target.value;
    const isValid = await validateInputToken(newToken);
    if (isValid) {
      setToken(newToken);
      // console.log(newToken);
    }
  };

  const percentageFormatter = (number) => `${Intl.NumberFormat("us").format(number).toString()}%`;

  return (
    <>
      <Head>
        <title>Partner Dashboard</title>
      </Head>
      <main className="bg-slate-50 p-6 sm:p-10">

        <Grid
          numItemsLg={5}
          className="p-6"
        >
          <Card>
            <Text>Shipments</Text>
            <Metric>{kpiShipments[0].total_shipments}</Metric>
          </Card>
          <Card>
            <Text>Pallets</Text>
            <Metric>To-do</Metric>
          </Card>
          <Card>
            <Text>Total Spent</Text>
            <Metric>${kpiSpent[0].total_spent}</Metric>
          </Card>
          <Card>
            <Text>On time pick ups</Text>
            <Metric>To-do%</Metric>
          </Card>
          <Card>
            <Text>On time drop offs</Text>
            <Metric>To-do%</Metric>
          </Card>
        </Grid>

        <TabGroup>
          <TabList className="mt-8">
            <Tab icon={ArchiveIcon}>Shipments</Tab>
            <Tab icon={ClipboardCheckIcon}>Service</Tab>
            <Tab icon={TableIcon}>Pallets</Tab>
            <Tab icon={ClockIcon}>Urgency</Tab>
            <Tab icon={CurrencyDollarIcon}>Spending</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <BarChart
                className="mt-6"
                data={chartShipments}
                index="t"
                categories={["total_shipments"]}
                colors={["blue"]}
                yAxisWidth={48}
              />
            </TabPanel>
            <TabPanel>
            <BarChart
                className="mt-6"
                data={chartOnTimePickups}
                index="t"
                categories={["on_time_pick_ups","delayed_pick_ups"]}
                colors={["green","red"]}
                yAxisWidth={48}
                stack={true}
              />
            </TabPanel>
            <TabPanel>
              <Card>
              To-do
              </Card>
            </TabPanel>
            <TabPanel>
              <Card>
              To-do
              </Card>
            </TabPanel>
            <TabPanel>
              <Card>
              To-do
              </Card>
            </TabPanel>
          </TabPanels>
        </TabGroup>



      </main>
    </>
  );
}