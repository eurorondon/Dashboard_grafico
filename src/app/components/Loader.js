import { Spinner } from "flowbite-react";
import React from "react";

export default function Loader() {
  return (
    <div style={styles.container}>
      <Spinner size={"xl"} />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "90vh",
    backgroundColor: "#fff",
  },
};
