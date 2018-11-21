import { app } from "./campaignServer";
import { Application } from "express";

let port = 3000;
app.listen(port, () => console.log(`App listening to ${port}`));