import * as React from "react";
import * as ReactDom from "react-dom";
import { PageRoot } from "./PageRoot";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap";

ReactDom.render(
    <PageRoot />,
    document.getElementById('appRoot')
)