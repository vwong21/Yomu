import React from "react";
import "../../Normalize.css";
import "./Extensions.css";
import { Nav } from "../../components/Nav/Nav";
import { Library } from "../../components/Library/Library";
import { ExtensionsList } from "../../components/ExtensionList/ExtensionsList";

export const Extensions = () => {
    return (
        <div id="app">
            <Nav />
            <ExtensionsList />
            <section id="details"></section>
        </div>
    );
};
