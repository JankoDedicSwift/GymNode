const { Member } = require("./models/members");
const mongoose = require("mongoose");
const config = require("config");

const data = [
  {
    firstName: "Janko",
lastName: "Dedic",
image: "images/JankoDedic_1.png",
    movies: [
      { title: "Airplane", numberInStock: 5, dailyRentalRate: 2 },
      { title: "The Hangover", numberInStock: 10, dailyRentalRate: 2 },
      { title: "Wedding Crashers", numberInStock: 15, dailyRentalRate: 2 }
    ]
  },
  {
    firstName: "Marko",
    lastName: "Dedic",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1280px-Node.js_logo.svg.png",
    movies: [
      { title: "Die Hard", numberInStock: 5, dailyRentalRate: 2 },
      { title: "Terminator", numberInStock: 10, dailyRentalRate: 2 },
      { title: "The Avengers", numberInStock: 15, dailyRentalRate: 2 }
    ]
  },
  {
    firstName: "Igor",
    lastName: "Dedic",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1280px-Node.js_logo.svg.png",
    movies: [
      { title: "The Notebook", numberInStock: 5, dailyRentalRate: 2 },
      { title: "When Harry Met Sally", numberInStock: 10, dailyRentalRate: 2 },
      { title: "Pretty Woman", numberInStock: 15, dailyRentalRate: 2 }
    ]
  },
  {
    firstName: "Stefan",
    lastName: "Dedic",
    image: "https://ibb.co/Sw6LhGB",
    movies: [
      { title: "The Sixth Sense", numberInStock: 5, dailyRentalRate: 2 },
      { title: "Gone Girl", numberInStock: 10, dailyRentalRate: 2 },
      { title: "The Others", numberInStock: 15, dailyRentalRate: 2 }
    ]
  }
];

async function seed() {
  await mongoose.connect(config.get("db"));

  await Member.deleteMany({});

  for (let member of data) {
    const { _id: memberId } = await new Member({
         firstName: member.firstName,
         lastName:member.lastName,
         image:member.image 
        }).save();

  }

  mongoose.disconnect();

  console.info("Done!");
}

seed();
