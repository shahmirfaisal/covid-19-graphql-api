const { GraphQLString, GraphQLObjectType } = require("graphql");

const CountryType = new GraphQLObjectType({
  name: "Country",
  description: "This is a Country.",
  fields: () => ({
    name: { type: GraphQLString },
    totalCases: { type: GraphQLString },
    newCases: { type: GraphQLString },
    totalDeaths: { type: GraphQLString },
    newDeaths: { type: GraphQLString },
    totalRecovered: { type: GraphQLString },
    activeCases: { type: GraphQLString },
    criticalCases: { type: GraphQLString },
    population: { type: GraphQLString },
  }),
});

module.exports = CountryType;
