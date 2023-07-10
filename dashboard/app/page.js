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
  const [kpiPallets, setKpiPallets] = useState([{ customer_name: '', total_pallets: 0 }]);
  const [kpiSpent, setKpiSpent] = useState([{ customer_name: '', total_spent: 0 }]);
  const [kpiPickupOntime, setKpiPickupOntime] = useState([{ customer_name: '', percent_picked_up_on_time: 0.0 }]);
  const [kpiDeliveredOntime, setKpiDeliveredOntime] = useState([{ customer_name: '', pct_delivered_ontime: 0.0 }]);
  const [chartShipments, setChartShipments] = useState([{ customer_name: '', t: '', total_shipments: 0 }]);
  const [chartService, setChartService] = useState([{ customer_name: '', t: '', on_time_drop_offs: 0, delayed_drop_offs: 0 }]);
  const [chartPallets, setChartPallets] = useState([{ customer_name: '', t: '', total_pallets: 0 }]);
  const [chartUrgency, setChartUrgency] = useState([{ customer_name: '', t: '', on_time_pick_ups: 0, delayed_pick_ups: 0 }]);
  const [chartSpending, setChartSpending] = useState([{ customer_name: '', t: '', total_spent: 0 }]);


  let date_from = dates.from ? new Date(dates.from.getTime() - dates.from.getTimezoneOffset() * 60000).toISOString() : new Date(2023, 5, 1).toISOString();
  let date_to = dates.to ? new Date(dates.to.getTime() - dates.to.getTimezoneOffset() * 60000 + 60000 * 60 * 24 - 1).toISOString() : date_from;

  let apiKpiShipments = `https://${TINYBIRD_HOST}/v0/pipes/api_kpis.json?kpi=shipments&token=${token}${date_from ? `&date_from=${date_from}` : ''}${date_to ? `&date_to=${date_to}` : ''}`;
  let apiKpiSpent = `https://${TINYBIRD_HOST}/v0/pipes/api_kpis.json?kpi=spent&token=${token}${date_from ? `&date_from=${date_from}` : ''}${date_to ? `&date_to=${date_to}` : ''}`;
  let apiKpiPallets = `https://${TINYBIRD_HOST}/v0/pipes/api_kpis.json?kpi=pallets&token=${token}${date_from ? `&date_from=${date_from}` : ''}${date_to ? `&date_to=${date_to}` : ''}`;
  let apiKpiPickupOntime = `https://${TINYBIRD_HOST}/v0/pipes/api_kpis.json?kpi=pct_pickup_ontime&token=${token}${date_from ? `&date_from=${date_from}` : ''}${date_to ? `&date_to=${date_to}` : ''}`;
  let apiKpiDeliveredOntime = `https://${TINYBIRD_HOST}/v0/pipes/api_kpis.json?kpi=pct_delivered_ontime&token=${token}${date_from ? `&date_from=${date_from}` : ''}${date_to ? `&date_to=${date_to}` : ''}`;

  let apiChartShipments = `https://${TINYBIRD_HOST}/v0/pipes/api_charts.json?kpi=shipments&token=${token}${date_from ? `&date_from=${date_from}` : ''}${date_to ? `&date_to=${date_to}` : ''}`;
  let apiChartService = `https://${TINYBIRD_HOST}/v0/pipes/api_charts.json?kpi=service&token=${token}${date_from ? `&date_from=${date_from}` : ''}${date_to ? `&date_to=${date_to}` : ''}`;
  let apiChartPallets = `https://${TINYBIRD_HOST}/v0/pipes/api_charts.json?kpi=pallets&token=${token}${date_from ? `&date_from=${date_from}` : ''}${date_to ? `&date_to=${date_to}` : ''}`;
  let apiChartUrgency = `https://${TINYBIRD_HOST}/v0/pipes/api_charts.json?kpi=urgency&token=${token}${date_from ? `&date_from=${date_from}` : ''}${date_to ? `&date_to=${date_to}` : ''}`;
  let apiChartSpending = `https://${TINYBIRD_HOST}/v0/pipes/api_charts.json?kpi=spending&token=${token}${date_from ? `&date_from=${date_from}` : ''}${date_to ? `&date_to=${date_to}` : ''}`;

  useInterval(() => {
    fetchTinybirdUrl(apiKpiShipments, setKpiShipments);
  }, msRefresh)

  useEffect(() => {
    fetchTinybirdUrl(apiKpiShipments, setKpiShipments);
  }, [apiKpiShipments]);

  useInterval(() => {
    fetchTinybirdUrl(apiKpiPallets, setKpiPallets);
  }, msRefresh)

  useEffect(() => {
    fetchTinybirdUrl(apiKpiPallets, setKpiPallets);
  }, [apiKpiPallets]);

  useInterval(() => {
    fetchTinybirdUrl(apiKpiSpent, setKpiSpent);
  }, msRefresh)

  useEffect(() => {
    fetchTinybirdUrl(apiKpiSpent, setKpiSpent);
  }, [apiKpiSpent]);

  useInterval(() => {
    fetchTinybirdUrl(apiKpiPickupOntime, setKpiPickupOntime);
  }, msRefresh)

  useEffect(() => {
    fetchTinybirdUrl(apiKpiPickupOntime, setKpiPickupOntime);
  }, [apiKpiPickupOntime]);

  useInterval(() => {
    fetchTinybirdUrl(apiKpiDeliveredOntime, setKpiDeliveredOntime);
  }, msRefresh)

  useEffect(() => {
    fetchTinybirdUrl(apiKpiDeliveredOntime, setKpiDeliveredOntime);
  }, [apiKpiDeliveredOntime]);

  useInterval(() => {
    fetchTinybirdUrl(apiChartShipments, setChartShipments);
  }, msRefresh)

  useEffect(() => {
    fetchTinybirdUrl(apiChartShipments, setChartShipments);
  }, [apiChartShipments]);

  useInterval(() => {
    fetchTinybirdUrl(apiChartService, setChartService);
  }, msRefresh)

  useEffect(() => {
    fetchTinybirdUrl(apiChartService, setChartService);
  }, [apiChartService]);

  useInterval(() => {
    fetchTinybirdUrl(apiChartPallets, setChartPallets);
  }, msRefresh)

  useEffect(() => {
    fetchTinybirdUrl(apiChartPallets, setChartPallets);
  }, [apiChartPallets]);

  useInterval(() => {
    fetchTinybirdUrl(apiChartUrgency, setChartUrgency);
  }, msRefresh)

  useEffect(() => {
    fetchTinybirdUrl(apiChartUrgency, setChartUrgency);
  }, [apiChartUrgency]);

  useInterval(() => {
    fetchTinybirdUrl(apiChartSpending, setChartSpending);
  }, msRefresh)

  useEffect(() => {
    fetchTinybirdUrl(apiChartSpending, setChartSpending);
  }, [apiChartSpending]);

  
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
      <Title>{kpiPallets[0].customer_name} Partnership Dashboard</Title>

      <Text>Token</Text>
            <TextInput
              value={token}
              onChange={handleInputTokenChange}
              className="mt-2 max-w-xs"
            // error={async (value) => !await validateInputToken(value)}
            />
      

      <DateRangePicker
            value={dates}
            onValueChange={setDates}
            enableYearPagination={true}
            dropdownPlaceholder="Pick dates"
            className="mt-2"
          />

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
            <Metric>{kpiPallets[0].total_pallets}</Metric>
          </Card>
          <Card>
            <Text>Total Spent</Text>
            <Metric>${kpiSpent[0].total_spent}</Metric>
          </Card>
          <Card>
            <Text>On time pick ups</Text>
            <Metric>{kpiPickupOntime[0].percent_picked_up_on_time}%</Metric>
          </Card>
          <Card>
            <Text>On time drop offs</Text>
            <Metric>{kpiDeliveredOntime[0].percent_delivered_on_time}%</Metric>
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
                data={chartService}
                index="t"
                categories={["on_time_drop_offs","delayed_drop_offs"]}
                colors={["green","red"]}
                yAxisWidth={48}
                stack={true}
              />
            </TabPanel>
            <TabPanel>
            <BarChart
                className="mt-6"
                data={chartPallets}
                index="t"
                categories={["total_pallets"]}
                colors={["cyan"]}
                yAxisWidth={48}
              />
            </TabPanel>
            <TabPanel>
              <BarChart
                className="mt-6"
                data={chartUrgency}
                index="t"
                categories={["on_time_pick_ups","delayed_pick_ups"]}
                colors={["green","red"]}
                yAxisWidth={48}
                stack={true}
              />
            </TabPanel>
            <TabPanel>
            <BarChart
                className="mt-6"
                data={chartSpending}
                index="t"
                categories={["total_spent"]}
                colors={["yellow"]}
                yAxisWidth={48}
              />
            </TabPanel>
          </TabPanels>
        </TabGroup>



      </main>
    </>
  );
}