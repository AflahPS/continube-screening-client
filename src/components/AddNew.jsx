import axios from "axios";
import React, { useState } from "react";
import { dragDb } from "../axios";

export const AddNew = ({ setSourceData, setTargetData }) => {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await dragDb({
      url: "/drag",
      method: "POST",
      data: { text, category },
    });
    if (data.status === "success") {
      if (category === "source") {
        setSourceData((prev) => [text, ...prev]);
        setText("");
        return;
      }
      setTargetData((prev) => [text, ...prev]);
    }
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="exampleInputEmail1">Text to add: </label>
        <input
          type="text"
          className="form-control"
          id="exampleInputEmail1"
          //   aria-describedby="emailHelp"
          placeholder="Enter some text here"
          onChange={(e) => {
            setText(e.target.value);
          }}
          value={text}
        />
      </div>
      <label htmlFor="cat"></label>
      <select
        id="cat"
        className="form-control"
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
        }}
      >
        <option value={"source"}>Source</option>
        <option value={"target"}>Target</option>
      </select>

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};
