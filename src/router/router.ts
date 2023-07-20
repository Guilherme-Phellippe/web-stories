import { Router } from "express"
import { PrismaClient } from "@prisma/client";

const app = Router();
const prisma = new PrismaClient();

/** redireciona para o link chamado */
app.get("/story/:slug", async (req: any, res: any) => {
  const { slug } = req.params;
  const keyword = slug.split("-").sort((a: string, b: string) => b.length - a.length )

  //push story select to database 
  const story: any = await prisma.stories.findFirst({
    where: {
      slug
    }
  });
  //push story select to database 
  const storiesRecommended: any = await prisma.stories.findMany({
    where: {
      OR: [
        { story_title: { contains: keyword[0] } },
        { story_title: { contains: keyword[1] } },
        { story_title: { contains: keyword[2] } },
        { story_title: { contains: " " } }
      ]
    }, select:{
      slug: true
    }
  });

  if (story) {
    const htmlContent = `
      <!doctype html>
      <html ⚡>
        <head>
          <meta charset="utf-8">
          <link rel="icon" href="https://i.ibb.co/Jr93jxd/favicon.png" />
          <title>${story.story_title}</title>
          <link rel="canonical" href="https://temsabor.blog">
          <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
          <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
          <script async src="https://cdn.ampproject.org/v0.js"></script>
          <script async custom-element="amp-video" src="https://cdn.ampproject.org/v0/amp-video-0.1.js"></script>
          <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
          <link href="https://fonts.googleapis.com/css?family=Oswald:200,300,400" rel="stylesheet">
          <style amp-custom>
            amp-story {
              font-family: 'Oswald',sans-serif;
              color: #fff;
            }
            amp-story-page {
              background-color: #000;
            }
            h1 {
              font-weight: bold;
              font-size: 2.875em;
              font-weight: normal;
              line-height: 1.174;
            }
            p {
              font-weight: normal;
              font-size: 1.3em;
              line-height: 1.5em;
              color: #fff;
            }
            q {
              font-weight: 300;
              font-size: 1.1em;
            }
            amp-story-grid-layer.bottom {
              align-content:end;
            }
            amp-story-grid-layer.noedge {
              padding: 0px;
            }
            amp-story-grid-layer.center-text {
              align-content: center;
            }
            .wrapper {
              display: grid;
              grid-template-columns: 50% 50%;
              grid-template-rows: 50% 50%;
            }
            .banner-text {
              text-align: center;
              background-color: #000;
              line-height: 2em;
            }
          </style>
          <script>
            setTimeout(()=>{
              localStorage.setItem("NextStories", JSON.stringify(${storiesRecommended}))
            })();
          </script>
        </head>
        <body>
          <!-- Cover page -->
          <amp-story standalone
              title=${story.story_title}
              publisher=${story.story_publisher}
              publisher-logo-src=${story.story_publisher_logo_src}
              poster-portrait-src=${story.story_poster_portrait_src}
          >
            ${story.pages.map((page: any) =>
      `<amp-story-page id=${page.page_id}>
                ${page.grid_layer} 
              </amp-story-page>`
    )}
            
            <!-- Bookend -->
            <amp-story-bookend src="../../bookend.json" layout="nodisplay"></amp-story-bookend>
          </amp-story>
        </body>
      </html>
      
      `;

    //If exist key on database return this key , if not return not found page
    res.send(htmlContent)
  }
  else res.send("Pagina não encontrada! :(")
});



export default app