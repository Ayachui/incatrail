import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";
export const OG_ALT =
  "The Inca Trail Foods - Purple Gold: unfermented Nacional cacao from Zamora Chinchipe, Ecuador";

/** Fonts live outside /public so they are only read during build-time rendering. */
const loadFont = (file: string) =>
  readFile(join(process.cwd(), "app", "_og", file));

const CLAIMS = ["0% FERMENTATION", "7H TREE TO BEAN", "100% ANTHOCYANINS"];

export async function renderOgImage() {
  const [cormorant, cormorantIt, inter] = await Promise.all([
    loadFont("cormorant-garamond-latin-300-normal.woff"),
    loadFont("cormorant-garamond-latin-400-italic.woff"),
    loadFont("inter-latin-400-normal.woff"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#030205",
          fontFamily: "Inter",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle at 24% 26%, rgba(107,33,168,0.55) 0%, rgba(3,2,5,0) 62%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle at 88% 92%, rgba(74,35,90,0.6) 0%, rgba(3,2,5,0) 55%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            display: "flex",
            border: "1px solid rgba(59,28,74,0.9)",
          }}
        />

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "76px 84px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: 56,
                  height: 1,
                  backgroundColor: "#9b59b6",
                  marginRight: 20,
                }}
              />
              <div
                style={{
                  display: "flex",
                  fontSize: 20,
                  letterSpacing: 6,
                  color: "#c39bd3",
                }}
              >
                ECUADOR · ZAMORA CHINCHIPE
              </div>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 19,
                letterSpacing: 4,
                color: "#6f6f78",
              }}
            >
              INCATRAILFOODS.COM
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontFamily: "Cormorant",
                fontSize: 86,
                lineHeight: 1.05,
                color: "#ffffff",
              }}
            >
              The Inca Trail Foods
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "Cormorant",
                fontStyle: "italic",
                fontSize: 60,
                lineHeight: 1.2,
                color: "#c39bd3",
                marginTop: 6,
              }}
            >
              Purple Gold
            </div>
            <div
              style={{
                display: "flex",
                maxWidth: 780,
                marginTop: 26,
                fontSize: 26,
                lineHeight: 1.5,
                color: "#a3a3a3",
              }}
            >
              Unfermented Nacional cacao. Seven hours from tree to sealed bean -
              the full native matrix preserved.
            </div>
          </div>

          <div style={{ display: "flex" }}>
            {CLAIMS.map((claim) => (
              <div
                key={claim}
                style={{
                  display: "flex",
                  padding: "10px 20px",
                  marginRight: 14,
                  border: "1px solid rgba(59,28,74,1)",
                  backgroundColor: "rgba(107,33,168,0.10)",
                  fontSize: 18,
                  letterSpacing: 3,
                  color: "#c39bd3",
                }}
              >
                {claim}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        {
          name: "Cormorant",
          data: cormorant,
          weight: 300,
          style: "normal",
        },
        {
          name: "Cormorant",
          data: cormorantIt,
          weight: 400,
          style: "italic",
        },
        {
          name: "Inter",
          data: inter,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
