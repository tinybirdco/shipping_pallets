# Data Project Readme

## Working with the Tinybird CLI

To start working with data projects as if they were software projects, let's install the Tinybird CLI in a virtual environment.
Check the [CLI documentation](https://docs.tinybird.co/cli.html) for other installation options and troubleshooting.

```bash
virtualenv -p python3 .e
. .e/bin/activate
pip install tinybird-cli
tb auth
```

Go to your workspace, copy a token with admin rights and paste it. A new `.tinyb` file will be created.

From here you can do the normal workflow of editing the project and using `tb push` to update it.

## Project description

```bash
├── datasources
│   ├── bq_shipping_pallets.datasource
│   ├── customers.datasource
│   └── shipping_by_day_mv.datasource
├── endpoints
│   ├── api_charts.pipe
│   ├── api_kpis.pipe
│   ├── customers_api.pipe
│   └── demo.pipe
└── pipes
    └── mat_shipping_by_day.pipe
```
