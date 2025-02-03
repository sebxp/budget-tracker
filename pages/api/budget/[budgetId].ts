import { ObjectId } from "mongodb";
import { NextApiResponse } from "next";
import { authenticateJWT, NextApiRequestWithUser } from "../../../utils/auth";
import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
  const db = await connectToDatabase();
  const id = req.query.budgetId;

  return authenticateJWT(req, res, async () => {
    if (req.method === "PUT") {
      try {
        const budget = req.body;
        const result = await db
          .collection("budgets")
          .updateOne(
            { _id: new ObjectId(id as string), userId: req.user.id },
            { $set: budget }
          );
        if (result.matchedCount === 0) {
          return res
            .status(404)
            .json({ message: "Budget item not found or not authorized" });
        }
        return res
          .status(201)
          .json({ message: "Budget item updated successfully" });
      } catch (error) {
        res.status(500).json({ message: "Failed to update budget item" });
      }
    }

    if (req.method === "DELETE") {
      try {
        const result = await db
          .collection("budgets")
          .deleteOne({ _id: new ObjectId(id as string), userId: req.user.id });
        if (result.deletedCount === 0) {
          return res
            .status(404)
            .json({ message: "Budget item not found or not authorized" });
        }
        return res
          .status(200)
          .json({ message: "Budget item deleted successfully" });
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Failed to delete budget item" });
      }
    }
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  });
}
