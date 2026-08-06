export const SITE_CONTENT = {
  about: {
    title: "Battlefield Aeronautics & Avionics Program",
    subtitle: "Pioneering High-Power Rocketry, Custom Avionics, and Atmospheric Science",
    badge: "MISSION CONTROL",
    description: `The Battlefield Aeronautics and Avionics Program (BAAP) is a premier student-led aerospace engineering and rocketry organization at Battlefield High School. Founded by passionate engineers and flight enthusiasts, BAAP builds custom high-altitude rockets, designs autonomous flight computers, conducts atmospheric research, and competes in national aerospace challenges.`,
    stats: [
      { label: "Max Altitude", value: "10,500+ FT", icon: "arrow-up" },
      { label: "Successful Launches", value: "48+", icon: "rocket" },
      { label: "Active Engineers", value: "35+", icon: "users" },
      { label: "Custom PCBs Built", value: "12", icon: "cpu" }
    ],
    mission: "To empower students through hands-on aerospace engineering, custom printed circuit board (PCB) avionics development, aerodynamic simulation, and real-world high-power rocket missions.",
    teams: [
      {
        name: "Avionics & Telemetry",
        icon: "cpu",
        color: "#9B5DE5",
        desc: "Designs flight computers with Teensy 4.1 microcontrollers, dual barometric altimeters, 9-DOF IMUs, live 915MHz LoRa long-range telemetry radio links, and solid-state ejection charge deployment controllers."
      },
      {
        name: "Flight Dynamics & CAD",
        icon: "compass",
        color: "#00F5D4",
        desc: "Utilizes OpenRocket, RasAero, and SolidWorks to engineer aerodynamic stability, optimize fin flutter margins, design composite fiberglass airframes, and model dual-deployment parachute ejection systems."
      },
      {
        name: "Payload & Scientific Research",
        icon: "flask",
        color: "#F15BB5",
        desc: "Engineers autonomous scientific payloads including UV radiation sensors, high-altitude atmospheric gas sampling canisters, stabilization gimbals, and high-definition 4K camera arrays."
      },
      {
        name: "Recovery & Ground Support",
        icon: "shield",
        color: "#FEE440",
        desc: "Constructs dual-deployment main/drogue parachute recovery systems, electronic black-box tracking beacons, GPS ground station tracking antennas, and mobile launch control pads."
      }
    ],
    officers: [
      {
        name: "Avi Patel",
        role: "President & Avionics Lead",
        bio: "Specializes in custom PCB routing, STM32/Teensy C++ flight software architecture, RF telemetry telemetry link optimization, and team mission operations.",
        image: "/images/logo.png"
      },
      {
        name: "Flight Operations Lead",
        role: "Aerodynamics & Structures",
        bio: "Leads composite fiberglass layup, fin flutter calculations in OpenRocket, motor selection (H to K impulse), and structural safety margin analysis.",
        image: "/images/logo.png"
      },
      {
        name: "Payload Lead",
        role: "Scientific Systems",
        bio: "Oversees scientific experiments, atmospheric pressure sensors, environmental telemetry, and real-time sensor data logging.",
        image: "/images/logo.png"
      }
    ]
  },

  timeline: {
    title: "Mission Flight Logs & Milestones",
    subtitle: "A chronicle of BAAP's aerospace achievements and launch history",
    badge: "FLIGHT RECORD",
    events: [
      {
        year: "2026",
        title: "Project Aether: 10,000ft Dual Deployment",
        tag: "High-Power Launch",
        desc: "Successfully launched 'Aether I' on a Cesaroni L1050 motor, reaching an apogee of 10,240 feet. Live telemetry transmitted over 12 miles with custom 915MHz LoRa ground station.",
        stats: "Apogee: 10,240 ft | Max Speed: Mach 1.1"
      },
      {
        year: "2025",
        title: "High Altitude Weather Balloon Stratosphere Mission",
        tag: "Atmospheric Research",
        desc: "Deployed a scientific balloon payload to 95,000 ft altitude with live APRS GPS tracker, temperature array, and 360-degree camera rig.",
        stats: "Altitude: 95,420 ft | Flight Time: 2h 45m"
      },
      {
        year: "2024",
        title: "Custom Flight Computer V3 Deployment",
        tag: "Avionics Breakthrough",
        desc: "Engineered and manufactured our 4-layer custom PCB flight computer featuring redundant BMP388 altimeters, micro-SD flight logging, and pyro-ejection MOSFETs.",
        stats: "PCB Layers: 4 | Microcontroller: Teensy 4.1"
      },
      {
        year: "2023",
        title: "TARC National Finalist Qualification",
        tag: "Competition",
        desc: "Qualified for the American Rocketry Challenge national finals with precise altitude and flight duration scoring under strict payload requirements.",
        stats: "National Rank: Top 40 | Target Altitude: 825 ft"
      },
      {
        year: "2022",
        title: "BAAP Founding & First High-Power Certification",
        tag: "Club Launch",
        desc: "Established the Battlefield Aeronautics and Avionics Program at Battlefield High School, achieving Level 1 & Level 2 NAR high-power rocketry certifications.",
        stats: "Founding Members: 12 | Initial Fleet: 4 Rockets"
      }
    ]
  },

  gallery: {
    title: "Mission Photo Gallery",
    subtitle: "Behind the scenes at the launch pad, lab, and ground station",
    badge: "VISUAL LOGS",
    photos: [
      {
        title: "Stratospheric Launch Day",
        category: "Launches",
        image: "/images/rocket1.jpg",
        caption: "Rocket ignition on launch pad 3 during the spring high-power test launch."
      },
      {
        title: "SpaceX Starship Field Trip & Research",
        category: "Field Trips",
        image: "/images/spacex1.jpg",
        caption: "BAAP members studying aerospace engine architectures."
      },
      {
        title: "High Altitude Balloon Flight Prep",
        category: "Weather Balloon",
        image: "/images/balloon1.jpeg",
        caption: "Inflating the helium weather balloon for the 95,000ft payload drop test."
      },
      {
        title: "Rocket Build & Fiberglass Assembly",
        category: "Build Workshops",
        image: "/images/vol1.jpg",
        caption: "Sanding fin bevels and aligning motor mounts in the school workshop."
      },
      {
        title: "Electronics & Soldering Session",
        category: "Avionics Lab",
        image: "/images/vol2.jpg",
        caption: "Soldering surface-mount sensors onto custom flight computer boards."
      },
      {
        title: "Ground Tracking Station Array",
        category: "Ground Station",
        image: "/images/spacex2.jpg",
        caption: "Yagi directional antenna array tracking real-time rocket telemetry."
      },
      {
        title: "Team Engineering Review",
        category: "Build Workshops",
        image: "/images/vol3.jpg",
        caption: "Conducting pre-flight structural mass and center-of-gravity balance tests."
      },
      {
        title: "BAAP Club Insignia",
        category: "Insignia",
        image: "/images/latin.png",
        caption: "Official Battlefield Aeronautics and Avionics Program emblem."
      }
    ]
  },

  resources: {
    title: "Hardware Schematics & Software Resources",
    subtitle: "Open-source rocket design files, flight code, and aerospace tools",
    badge: "LAB REPOSITORY",
    items: [
      {
        title: "BAAP Flight Computer V3 Schematics (KiCAD)",
        type: "Hardware Schematic",
        icon: "cpu",
        desc: "Complete Gerber files and KiCAD schematic for our Teensy 4.1 flight computer with BMP388 altimeter and LoRa radio transceiver.",
        link: "#",
        badge: "v3.2 Gerber / PCB"
      },
      {
        title: "C++ Flight Software Firmware (GitHub)",
        type: "Software Code",
        icon: "code",
        desc: "Real-time operating system (RTOS) firmware written in C++ for sensor fusion (Kalman filter), ejection pyro deployment, and SD data logging.",
        link: "https://github.com/bhsavionics",
        badge: "C++ / FreeRTOS"
      },
      {
        title: "OpenRocket Flight Simulation Files (.ork)",
        type: "3D CAD & Flight Sim",
        icon: "box",
        desc: "Aerodynamic flight simulation files for 'Aether I' and 'Phoenix II' including fin flutter margins, motor thrust curves, and apogee predictions.",
        link: "#",
        badge: "OpenRocket 23.09"
      },
      {
        title: "915MHz Ground Station Telemetry GUI",
        type: "Ground Station Software",
        icon: "radio",
        desc: "Web-based Python/Flask live telemetry dashboard for plotting altitude, velocity, battery voltage, and GPS coordinates during flight.",
        link: "#",
        badge: "Python / WebSockets"
      },
      {
        title: "Pre-Flight Checklist & Safety Protocols",
        type: "Operations Manual",
        icon: "file-text",
        desc: "Official NAR/TRA safety checklist for high-power rocket assembly, electronic black-powder charge prep, and launch pad arming.",
        link: "#",
        badge: "PDF Checklist"
      }
    ]
  },

  merch: {
    title: "BAAP Flight Crew Apparel & Gear",
    subtitle: "Support our high-power rocketry launch program with official gear",
    badge: "CLUB SHOP",
    items: [
      {
        id: "tshirt",
        title: "BAAP Mission Flight Tee",
        price: "$22.00",
        desc: "100% heavy cotton dark violet tee featuring the BAAP orbital rocket schematics back print.",
        color: "Dark Violet / Cyan Glow",
        sizes: ["S", "M", "L", "XL", "2XL"]
      },
      {
        id: "patch",
        title: "Aether 10,000ft Mission Embroidered Patch",
        price: "$8.00",
        desc: "3.5-inch metallic thread embroidered patch celebrating our 10,000ft apogee flight milestone.",
        color: "Purple & Gold Thread"
      },
      {
        id: "sticker",
        title: "Holographic Rocket Avionics Sticker Pack",
        price: "$5.00",
        desc: "Pack of 4 weatherproof die-cut holographic vinyl stickers for laptops, gear cases, and water bottles.",
        color: "Holographic Chrome"
      },
      {
        id: "hoodie",
        title: "BAAP Ground Control Heavyweight Hoodie",
        price: "$45.00",
        desc: "Ultra-warm fleece pullover hoodie with high-density embroidered chest emblem and sleeve flight code patch.",
        color: "Midnight Black",
        sizes: ["S", "M", "L", "XL", "2XL"]
      }
    ]
  },

  blog: {
    title: "Aerospace Blog & Flight Reports",
    subtitle: "Articles on rocket engineering, PCB design, and launch recaps",
    badge: "FLIGHT JOURNAL",
    posts: [
      {
        id: "post-1",
        title: "Engineering a 10,000 Foot High-Power Rocket: Lessons from Aether I",
        date: "March 15, 2026",
        author: "Avi Patel",
        category: "Flight Report",
        readTime: "6 min read",
        snippet: "Reaching two miles high requires more than raw thrust. Here is how we calculated aerodynamic fin drag, reinforced fiberglass joints, and tuned dual-deployment recovery altimeters.",
        content: `Launching to 10,000 feet requires careful balancing of thrust-to-weight ratio, structural rigidity, and recovery safety. In this flight analysis, we break down our motor selection (Cesaroni L1050), fin flutter calculations in RasAero, and the dual-deployment parachute deployment sequence.`
      },
      {
        id: "post-2",
        title: "Designing Custom Altimeter PCBs for High-G Rocket Environments",
        date: "February 28, 2026",
        author: "Avionics Team",
        category: "Hardware",
        readTime: "8 min read",
        snippet: "Standard off-the-shelf microcontrollers can disconnect under 15G launch acceleration. Learn how we routed high-G SMD components and isolated barometric pressure sensor ports.",
        content: `High acceleration forces can tear loose solder joints or introduce sensor noise in barometric pressure readings. Our custom PCB utilizes surface-mount components, mechanical strain reliefs, and dual redundant BMP388 pressure sensors with low-pass digital filtering.`
      },
      {
        id: "post-3",
        title: "Building a 915MHz LoRa Long-Range Telemetry Link",
        date: "January 20, 2026",
        author: "Software Team",
        category: "Software",
        readTime: "5 min read",
        snippet: "How we achieved continuous 12-mile wireless telemetry using Semtech SX1276 LoRa transceivers and directional Yagi ground tracking antennas.",
        content: `Wireless communications from a supersonic rocket present unique challenges including Doppler shifts and RF signal attenuation. By implementing forward error correction (FEC) and directional Yagi tracking antennas, we achieved zero packet loss throughout the entire apogee trajectory.`
      }
    ]
  }
};
