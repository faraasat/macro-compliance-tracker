import nextConnect from "next-connect";
import middleware from "../../middleware/database";
import { ObjectID } from "mongodb";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  try {
    const { date } = req.query;

    const dataModel = {
      _id: new ObjectID(),
      date: date,
      calories: { label: "Calories", total: 0, target: 0, variant: 0 },
      carbs: { label: "Carbs", total: 0, target: 0, variant: 0 },
      fat: { label: "Fat", total: 0, target: 0, variant: 0 },
      protein: { label: "Protein", total: 0, target: 0, variant: 0 },
    };

    let doc = {};

    if (date) {
      doc = await req.db.collection("daily").findOne({ date: date });
    } else {
      doc = await req.db.collection("daily").findOne();
    }
    if (doc == null) {
      doc = dataModel;
    }
    res.json(doc);
  } catch (error) {
    console.log(error);
  }
});

handler.post(async (req, res) => {
  try {
    let data = req.body;
    data = JSON.parse(data);
    let doc = await req.db
      .collection("daily")
      .updateOne({ date: data.date }, { $set: data }, { upsert: true });
    res.json({ statusCode: 200, data: doc });
  } catch (error) {
    console.log(error);
  }
});

// export default (req, res) => handler.apply(req, res);
export default handler;
