const {
  GraphQLSchema,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const request = require("request-promise");
const cheerio = require("cheerio");
const extractData = require("../utils/extract-data");
const CountryType = require("./CountryType");
const GlobalType = require("./GlobalType");
require("dotenv").config();

const { URL } = process.env;

const RootQueryType = new GraphQLObjectType({
  name: "RootQuery",
  description: "This is the Root Query.",
  fields: () => ({
    global: {
      type: GlobalType,
      resolve: async () => {
        const html = await request(URL);
        const $ = cheerio.load(html);

        const totalCases = $("#maincounter-wrap > div > span")
          .eq(0)
          .text()
          .trim();
        const totalDeaths = $("#maincounter-wrap > div > span")
          .eq(1)
          .text()
          .trim();
        const totalRecovered = $("#maincounter-wrap > div > span")
          .eq(2)
          .text()
          .trim();
        const activeCases = $(
          "body > div.container > div:nth-child(2) > div.col-md-8 > div > div:nth-child(14) > div > div.panel-body > div > div.panel_front > div.number-table-main"
        )
          .text()
          .trim();
        const closedCases = $(
          "body > div.container > div:nth-child(2) > div.col-md-8 > div > div:nth-child(15) > div > div.panel-body > div > div.panel_front > div.number-table-main"
        )
          .text()
          .trim();

        return {
          totalCases,
          totalDeaths,
          totalRecovered,
          activeCases,
          closedCases,
        };
      },
    },

    countries: {
      type: new GraphQLList(CountryType),
      resolve: async () => {
        const html = await request(URL);
        const $ = cheerio.load(html);
        const rows = $(
          "#main_table_countries_today > tbody:nth-child(2)"
        ).children("tr");

        const countries = [];

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];

          const isHide = $(row).css("display") === "none";

          if (!isHide) {
            const country = extractData($, row);

            // We only want countries related info
            if (country.name === "World") continue;

            countries.push(country);
          }
        }

        return countries;
      },
    },

    country: {
      type: CountryType,
      args: {
        name: { type: GraphQLString, description: "Name of the Country." },
      },
      resolve: async (parent, { name }) => {
        name = name.trim().toLowerCase();

        var html = await request(URL);
        const $ = cheerio.load(html);
        const rows = $(
          "#main_table_countries_today > tbody:nth-child(2)"
        ).children("tr");

        let country;

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const countryName = $(row)
            .children("td")
            .eq(1)
            .text()
            .trim()
            .toLowerCase();

          // We only want countries related info
          if (name === "world") break;

          if (countryName === name) {
            country = extractData($, row);
            break;
          }
        }

        return country;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

module.exports = schema;
