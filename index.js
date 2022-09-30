var { graphqlHTTP } = require("express-graphql");
var { buildSchema, assertInputType } = require("graphql");
var express = require("express");
const { argsToArgsConfig } = require("graphql/type/definition");

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    "id": 1,
    "name": "WoodsHill ",
    "description":
      "American cuisine, farm to table, with fresh produce every day",
    "dishes": [
      {
        "name": "Swordfish grill",
        "price": 27,
      },
      {
        "name": "Roasted Broccily ",
        "price": 11,
      },
    ],
  },
  {
    "id": 2,
    "name": "Fiorellas",
    "description":
      "Italian-American home cooked food with fresh pasta and sauces",
    "dishes": [
      {
        "name": "Flatbread",
        "price": 14,
      },
      {
        "name": "Carbonara",
        "price": 18,
      },
      {
        "name": "Spaghetti",
        "price": 19,
      },
    ],
  },
  {
    "id": 3,
    "name": "Karma",
    "description":
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    "dishes": [
      {
        "name": "Dragon Roll",
        "price": 12,
      },
      {
        "name": "Pancake roll ",
        "price": 11,
      },
      {
        "name": "Cod cakes",
        "price": 13,
      },
    ],
  },
];
var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint

var root = {
  restaurant: (arg) =>  {
    // Your code goes here
    return restaurants.find(restaurant => restaurant.id === arg.id)
  },
  restaurants: () => {
    // Your code goes here
    return restaurants
  },
  setrestaurant: ({ input }) => {
    // Your code goes here
    // Find which will be the next ID to assign the new restaurant:
    const newID = Math.max(...restaurants.map(restaurant => restaurant.id)) + 1
    restaurants.push({name: input.name, description:input.description, id:newID})
    return input
  },
  deleterestaurant: ( arg ) => {
    // Your code goes here
    const ok = Boolean(restaurants.find(restaurant => restaurant.id === arg.id))
    // console.log(restaurants.id)
    restaurants = restaurants.filter(restaurant => restaurant.id !== arg.id)
    return { ok }
  },

  editrestaurant: ({ id, ...restaurant }) => {
    // Your code goes here
    const idx = restaurants.findIndex( restaurant => restaurant.id === id)
    if (idx < 0) {
      throw new Error("restaurant doesn't exist")
    }
    
    restaurants.splice(idx, 1, {
      ...restaurants[idx], ...restaurant
    })
    return restaurants[idx]
  },
};
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));

// export default root;
