import type { IconName } from "@/lib/site";

const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function Icon({ name }: { name: IconName | "temp" | "gps" | "people" | "calc" | "headset" | "quiz" }) {
  switch (name) {
    case "lastmile":
      return (<svg viewBox="0 0 32 32" aria-hidden="true"><path {...P} d="M3 21V10h14v11M17 14h6l4 4v3h-3" /><circle {...P} cx="9" cy="23" r="2.5" /><circle {...P} cx="22" cy="23" r="2.5" /><path {...P} d="M26 6l2 2-2 2M20 8h8" /></svg>);
    case "midmile":
      return (<svg viewBox="0 0 32 32" aria-hidden="true"><rect {...P} x="2" y="6" width="8" height="8" rx="1" /><rect {...P} x="22" y="18" width="8" height="8" rx="1" /><path {...P} d="M10 10h6a3 3 0 0 1 3 3v6a3 3 0 0 0 3 3" /><path {...P} d="M19 19l3 3 3-3" /></svg>);
    case "loop":
      return (<svg viewBox="0 0 32 32" aria-hidden="true"><path {...P} d="M6 12a10 10 0 0 1 18-3M26 20a10 10 0 0 1-18 3" /><path {...P} d="M24 4v5h-5M8 28v-5h5" /><circle {...P} cx="16" cy="16" r="2" /></svg>);
    case "pin":
      return (<svg viewBox="0 0 32 32" aria-hidden="true"><path {...P} d="M16 29s9-8.5 9-15a9 9 0 0 0-18 0c0 6.5 9 15 9 15z" /><circle {...P} cx="16" cy="14" r="3.2" /></svg>);
    case "glove":
      return (<svg viewBox="0 0 32 32" aria-hidden="true"><path {...P} d="M9 17V8a2 2 0 0 1 4 0v7M13 14V6a2 2 0 0 1 4 0v8M17 14V7a2 2 0 0 1 4 0v9M21 15v-4a2 2 0 0 1 4 0v8a9 9 0 0 1-9 9h-1a8 8 0 0 1-6.5-3.4L5 19a2 2 0 0 1 3.2-2.4L9 17.5" /></svg>);
    case "trailer":
      return (<svg viewBox="0 0 32 32" aria-hidden="true"><rect {...P} x="2" y="8" width="20" height="13" rx="1" /><path {...P} d="M22 12h4l4 4v5h-8" /><circle {...P} cx="8" cy="23.5" r="2.3" /><circle {...P} cx="25" cy="23.5" r="2.3" /><path {...P} d="M6 12h4M6 16h8" /></svg>);
    case "temp":
      return (<svg viewBox="0 0 32 32" aria-hidden="true"><path {...P} d="M13 19V6a3 3 0 0 1 6 0v13a5 5 0 1 1-6 0z" /><path {...P} d="M16 11v10" /><path {...P} d="M23 8h4M23 12h3M23 16h4" /></svg>);
    case "gps":
      return (<svg viewBox="0 0 32 32" aria-hidden="true"><circle {...P} cx="16" cy="16" r="9" /><circle {...P} cx="16" cy="16" r="3" /><path {...P} d="M16 2v5M16 25v5M2 16h5M25 16h5" /></svg>);
    case "people":
      return (<svg viewBox="0 0 32 32" aria-hidden="true"><circle {...P} cx="11" cy="10" r="4" /><circle {...P} cx="22" cy="12" r="3" /><path {...P} d="M3 26a8 8 0 0 1 16 0M18 26a6 6 0 0 1 11-3" /></svg>);
    case "calc":
      return (<svg viewBox="0 0 32 32" aria-hidden="true"><rect {...P} x="6" y="3" width="20" height="26" rx="3" /><rect {...P} x="10" y="7" width="12" height="5" rx="1" /><path {...P} d="M11 17h.01M16 17h.01M21 17h.01M11 22h.01M16 22h.01M21 22h.01" strokeWidth={3} /></svg>);
    case "headset":
      return (<svg viewBox="0 0 32 32" aria-hidden="true"><path {...P} d="M6 18v-3a10 10 0 0 1 20 0v3" /><rect {...P} x="4" y="17" width="5" height="8" rx="2" /><rect {...P} x="23" y="17" width="5" height="8" rx="2" /><path {...P} d="M26 25c0 2-2 4-6 4h-3" /></svg>);
    case "quiz":
      return (<svg viewBox="0 0 32 32" aria-hidden="true"><circle {...P} cx="16" cy="16" r="12" /><path {...P} d="M12.5 12.5a3.5 3.5 0 1 1 5 3.2c-1 .5-1.5 1.3-1.5 2.3v.5" /><path {...P} d="M16 22.5h.01" strokeWidth={3} /></svg>);
  }
}
