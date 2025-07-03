// src/app/test-map_old/page.tsx
import React from "react";

 
// console.log("--- Server: test-map/page.tsx (top-level execution) ---");

const TestMapPage = () => {
   
  // console.log("--- Server: TestMapPage component function entered ---");
  return (
    <div>
      <h1>Hello from Test Map Page!</h1>
      <p>This is a minimal page to check server-side rendering.</p>
    </div>
  );
};

export default TestMapPage;

 
// console.log("--- Server: test-map/page.tsx (after component export) ---");