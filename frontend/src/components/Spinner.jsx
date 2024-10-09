import React from "react";
import { ClipLoader } from "react-spinners";

const Spinner = () => { //loading buffer symbol
  return (
    <>
      <section
        style={{
          minHeight: "350px", //525
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ClipLoader size={100} />
      </section>
    </>
  );
};

export default Spinner;