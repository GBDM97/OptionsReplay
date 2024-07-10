import React, { Dispatch, SetStateAction, useState } from "react";
import "../App.css";

const PeriodSelector: React.FC<{
  text1: string;
  text2: string;
  click: Function;
}> = ({ click, text1, text2 }) => {
  return (
    <span style={{ margin: "20px" }}>
      <input type="checkbox" onClick={() => click()} />
      {text1}
      <p>{text2}</p>
      <br />
      <br />
    </span>
  );
};

export default PeriodSelector;
