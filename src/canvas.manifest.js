export const manifest = {
  screens: {
    scr_dld1ta: { name: "Home", route: "/", position: { "x": 160, "y": 220 } },
    scr_c20r53: { name: "Product", route: "/product", position: { "x": 7160, "y": 220 } },
    scr_tq9vy3: { name: "About", route: "/about", position: { "x": 1560, "y": 220 } },
    scr_f86ymk: { name: "Use Cases", route: "/use-cases", position: { "x": 2960, "y": 220 } },
    scr_wcxhn8: { name: "Pricing", route: "/pricing", position: { "x": 4360, "y": 220 } },
    scr_jqsa8d: { name: "Contact", route: "/contact", position: { "x": 5760, "y": 220 } },
    scr_dejawc: { name: "Sign In", route: "/signin", position: { "x": 160, "y": 2200 } },
    scr_l33dmn: { name: "Sign Up", route: "/signup", position: { "x": 1560, "y": 2200 } },
    scr_rw3ot4: { name: "New Swarm", route: "/app/new", position: { "x": 160, "y": 6160 } },
    scr_odgts7: { name: "History", route: "/app/history", position: { "x": 2960, "y": 4180 } },
    scr_rdqpc2: { name: "Credits", route: "/app/credits", position: { "x": 4360, "y": 4180 } },
    scr_k85ds3: { name: "Live Swarm", route: "/app/live", position: { "x": 1560, "y": 6160 } },
    scr_k0jqur: { name: "Report", route: "/app/report", position: { "x": 2960, "y": 6160 } },
    scr_ty3fgq: { name: "Settings", route: "/app/settings", position: { "x": 1560, "y": 4180 } }
  },
  sections: {
    sec_0ulg20: { name: "Main Navigation", x: 0, y: 0, width: 8520, height: 1180 },
    sec_d3lslx: { name: "Authentication", x: 0, y: 1980, width: 2920, height: 1180 },
    sec_yulexw: { name: "App Dashboard", x: 0, y: 3960, width: 5720, height: 1180 },
    sec_gcwr4z: { name: "App Flows", x: 0, y: 5940, width: 4320, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_0ulg20", children: [
    { kind: "screen", id: "scr_dld1ta" },
    { kind: "screen", id: "scr_tq9vy3" },
    { kind: "screen", id: "scr_f86ymk" },
    { kind: "screen", id: "scr_wcxhn8" },
    { kind: "screen", id: "scr_jqsa8d" },
    { kind: "screen", id: "scr_c20r53" }]
  },
  { kind: "section", id: "sec_d3lslx", children: [
    { kind: "screen", id: "scr_dejawc" },
    { kind: "screen", id: "scr_l33dmn" }]
  },
  { kind: "section", id: "sec_yulexw", children: [
    { kind: "screen", id: "scr_ty3fgq" },
    { kind: "screen", id: "scr_odgts7" },
    { kind: "screen", id: "scr_rdqpc2" }]
  },
  { kind: "section", id: "sec_gcwr4z", children: [
    { kind: "screen", id: "scr_rw3ot4" },
    { kind: "screen", id: "scr_k85ds3" },
    { kind: "screen", id: "scr_k0jqur" }]
  }]

};