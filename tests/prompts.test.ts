import { getPromptDetailsFromUrl, getPromptUrl } from "src/urls";

import { getPrompt } from "src/index";

describe("Fetches data from url", () => {
  test("Fetches prompt id from url", async () => {
    const promptData = await getPromptDetailsFromUrl({
      url: "https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_2020/prompts/2644428",
    });
    expect(promptData).toMatchObject({
      promptId: "2644428",
    });
  });

  test("Fetches collection name from url", async () => {
    const workData = await getPromptDetailsFromUrl({
      url: "https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_2020/prompts/2644428",
    });

    expect(workData).toMatchObject({
      promptId: "2644428",
      collectionName: "mo_dao_zu_shi_kink_meme_2020",
    });
  });
});

describe("Gets url from data", () => {

  test("Gets url with collection name and prompt id", async () => {
    const workUrl = await getPromptUrl({
      promptId: "2644428",
      collectionName: "mo_dao_zu_shi_kink_meme_2020",
    });

    expect(workUrl).toBe(
      "https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_2020/prompts/2644428"
    );
  });

});


  describe("Fetches prompt information", () => {

    test("Fetches prompt published date", async () => {
      const prompt = await getPrompt({
        promptId: "2644428",
        collectionName: "mo_dao_zu_shi_kink_meme_2020"
      });

      expect(prompt).toMatchObject({
        postedAt: "23 May 2022",
        summary: `<p>A big round of applause for all our prompters and fillers for making the first round of the MDZS Kink Meme on AO3 such a rousing success! If you want to submit your own prompt, the most recent round of prompts (2022) can be found <a href="https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_2022/requests" rel="nofollow">here</a>, and any past or future rounds can be found in the MDZS Kink Meme <a href="https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme" rel="nofollow">Parent Collection</a>.</p><p> KEEP CLAIMING &amp; FILLING THESE PROMPTS! Prompts from ANY round of the MDZS Kink Meme can be filled indefinitely. We will always accept more fills for old prompts!<br> • <a href="https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_2020/requests" rel="nofollow">2020 Prompts</a><br> • <a href="https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_21Q1/requests" rel="nofollow">2021 Q1 Prompts</a><br> • <a href="https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_21Q2/requests" rel="nofollow">2021 Q2 Prompts</a></p><p> Also, if you'd like to fill a <a href="https://pinboard.in/u:mdzs-kinkmeme/t:%252APROMPT_DELETED_but_can_still_be_filled_and_submitted_to_collection%2521%252A" rel="nofollow">deleted prompt</a> you found on the Pinboard, you can add it to the collection by claiming &amp; filling this prompt!</p>`
      });
    });


    test("Fetches null summary", async () => {
      const prompt = await getPrompt({
        promptId: "3566161",
        collectionName: "test_prompt_meme_2024"
      });

      expect(prompt).toMatchObject({
        summary: null,
      });
    });

    test("Fetches display title", async () => {
      const prompt = await getPrompt({
        promptId: "2644428",
        collectionName: "mo_dao_zu_shi_kink_meme_2020"
      });

      expect(prompt).toMatchObject({
        collectionDisplayTitle: "Mó Dào Zǔ Shī | The Untamed Kink Meme 2020",
      });
    });


    test("Fetches Ratings", async () => {
      const prompt = await getPrompt({
        promptId: "1927806",
        collectionName: "mo_dao_zu_shi_kink_meme_2020"
      });

      expect(prompt).toMatchObject({
        ratings: ["General Audiences", "Teen And Up Audiences", "Mature"],
      });
    });

    test("Fetches \"Not Rated\" for no specified ratings", async () => {
      const prompt = await getPrompt(
        await getPromptDetailsFromUrl({
          url: "https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_2020/prompts/2644428",
        })
      );

      expect(prompt).toMatchObject({
        ratings: ["Not Rated"],
      });
    });

    test("Fetches Author(+pseud)", async () => {
      const prompt = await getPrompt(
        await getPromptDetailsFromUrl({
          url: "https://archiveofourown.org/collections/test_prompt_meme_2024/prompts/3573835",
        })
      );

      expect(prompt).toMatchObject({
        author: {  
          username: "RabbitPie",
          pseud: "cottontailcake"}
      });
    });

    test("Fetches Anonymous Author", async () => {
      const prompt = await getPrompt(
        await getPromptDetailsFromUrl({
          url: "https://archiveofourown.org/collections/test_prompt_meme_2024/prompts/3574012",
        })
      );

      expect(prompt).toMatchObject({
        author: "Anonymous"
      });
    });

    test("Fetches Non-Pseuded Author", async () => {
      const prompt = await getPrompt(
        await getPromptDetailsFromUrl({
          url: "https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_2020/prompts/2644428",
        })
      );

      expect(prompt).toMatchObject({
        author: {
          username: "merelydovely",
          pseud: "merelydovely"
        },
      });
    });

    test("Fetches fandoms, addition, characters, relationships and warnings tags", async () => {
      const prompt = await getPrompt(
        await getPromptDetailsFromUrl({
          url: "https://archiveofourown.org/collections/test_prompt_meme_2024/prompts/3573835",
        })
      );
      expect(prompt).toMatchObject({
        fandoms: ["SD Gundam G Generation Series (Video Games)", "Babel - R. F. Kuang"],
        tags: {
          warnings: ["Creator Chose Not To Use Archive Warnings"],
          characters: ["Kate Schmidt (Fear Street)","Sa Beining","Ffion Foxwell"],
          relationships: ["Sophie Lee/Rune (Sdorica)","CC-2224 | Cody & CT-7567 | Rex","Denji/Mitaka Asa"],
          additional: ["Ewok Species (Star Wars)","FS Lobby Discord's GP Predictions Game","Natasha \"Phoenix\" Trace Needs a Hug"]
        }
      });
    });


    test("Fetches 0 claims", async () => {
      const prompt = await getPrompt(
        await getPromptDetailsFromUrl({url: "https://https://archiveofourown.org/collections/test_prompt_meme_2024/prompts/3573835"})
      );
      expect(prompt).toMatchObject({
        claims: {count: 0},
      });
    });      

    test("Fetches Anon Claims + No Known Claimaints", async () => {
      const prompt = await getPrompt(
        await getPromptDetailsFromUrl({url: "https://https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_2020/prompts/1909048"})
      );
      expect(prompt).toMatchObject({
        claims: {count: 3, isAnonCollection: true},
      });
    });  

    test("Fetches Known Claimaints+No Anon Claimaints", async () => {
      const prompt = await getPrompt(
        await getPromptDetailsFromUrl({url: "https://https://archiveofourown.org/collections/test_prompt_meme_2024/prompts/3583348"})
      );
      expect(prompt).toMatchObject({
        claims: {count: 2, isAnonCollection: false, claimantUsernames:["RabbitPie","enigmalea"]},
      });
    });  
 

    
    });



    describe("Fetches full Prompt", () => {

      test("Fetches multiple fills", async () => {
        //https://archiveofourown.org/collections/mo_dao_zu_shi_kink_meme_2020/prompts/1909048
        const prompt = await getPrompt({
          promptId: "1909048",
          collectionName: "mo_dao_zu_shi_kink_meme_2020"
        });
  
        expect(prompt).toMatchObject({
          postedAt: '30 Nov 2020',
          summary: "<p>Jin Guangyao reincarnates as a cockroach in the Cloud Recesses. Lan Xichen is still in seclusion and enjoys having a little bug friend. Up to you if he knows or just thinks the roach is A-Yao because of a marking or something, or if he doesn't know at all and is just being a friend to all animals. And lonely.</p><p>Bonus: Da-ge spiderbro.</p><p>DNW: Bugfucking, the whole thing being humor. Plz make this stone-cold crack treated seriously.</p>",
          collectionDisplayTitle: "Mó Dào Zǔ Shī | The Untamed Kink Meme 2020",
          categories: ["No Category"],
          ratings: ["Not Rated"],
          author: "Anonymous",
          fandoms: ['陈情令 | The Untamed (TV)'],

          // tags: {
          //   warnings: ["Author Chose Not To Use Archive Warnings"],
          //   characters: [],
          //   relationships: ['Lan Huan | Lan Xichen/Meng Yao | Jin Guangyao'],
          //   additional: ['Crack Treated Seriously'],
          // },
          // claims: {count: 3, isAnonCollection: true;},
          // title: "jgy reincarnates as a cockroach",
          // collectionName: "mo_dao_zu_shi_kink_meme_2020",
          // id: "1909048",
          // filled: true,
          // fills: [
          //   {//Fill 1
          //     id: "29946057",
          //     title: "Exoskeletons In My Closet",
          //     category: "Gen",
          //     updatedAt: "19 Nov 2021",
          //     summary: "<p>After dying, the last thing Jin Guangyao expected was to wake up again. </p><p>Finding himself reincarnated in the Cloud Recesses is a bit of a shock; particularly given the fact that he's in the perfect position to witness the exact effects the fallout of his bad choices have on the only true friend he ever had. Struck by guilt, he's determined to do right for once, and find a way to make things better for Lan Xichen. </p><p>A task which is significantly complicated by the fact that he wasn't actually reborn as a human. Instead he's… <i>a cockroach?!</i> </p><p>Can Jin Guangyao help Lan Xichen, despite being roach-ified? </p><p>(…And <i>why on earth</i> does it look like that big, hairy spider glowering at him from the corner across the Hanshi is trying to sharpen a tiny stick into a <i>sabre?</i>)</p>",
          //     rating: "General Audiences",
          //     adult: false,
          //     fandoms: ["魔道祖师 - 墨香铜臭 | Módào Zǔshī - Mòxiāng Tóngxiù, 魔道祖师 | Módào Zǔshī (Cartoon)", "陈情令 | The Untamed (TV)"],

              
          //     tags: {
          //       warnings: ["No Archive Warnings Apply"],
          //       characters: ['Meng Yao | Jin Guangyao','Lan Huan | Lan Xichen','Nie Mingjue'],
          //       relationships: ["Lán Huàn | Lán Xīchén & Mèng Yáo | Jīn Guāngyáo", "Meng Yao | Jin Guangyao & Nie Mingjue"],
          //       additional:['Reincarnation', 'Cockroaches', 'Spiders', 'Bugs & Insects', 'Crack Treated Seriously', 'Rebirth', 'Redemption', 'Mèng Yáo | Jīn Guāngyáo Redemption', 'Da-ge Spider-Bro', 'JGY is a Cockroach', 'Protective Niè Míngjué', 'Oblivious Lán Huàn | Lán Xīchén', 'Lán Huàn | Lán Xīchén in Seclusion', "Niè Míngjué Is Lán Xīchén's Self-Appointed Guard Spider", "Jīn Guāngyáo's Life Is Hard", 'Being A Cockroach Is Surprisingly Dangerous'],
          //     },
          //     authors: [{username: "DeiStarr", pseud: "DeiStarr"}],
          //     language: "English",
          //     words: 4386,
          //     chapters: {
          //       published: 7,
          //       total: 17,
          //     },
          //     series: [
          //       {
          //         id: "1928872",
          //         index: 28,
          //         name: "MDZS Kink Meme 2020 Prompt Fills"
          //       }
          //     ],
          //     complete: false,
          //     stats: {
          //       bookmarks: 45,
          //       comments: 62,
          //       kudos: 181,
          //       hits: 2320,
          //     },
          //   },
          //   {
          //     id: "29946057",
          //     title: "Exoskeletons In My Closet",
          //     category: ["Gen"],
          //     publishedAt: "19 Nov 2021",
          //     summary: "<p>After dying, the last thing Jin Guangyao expected was to wake up again. </p><p>Finding himself reincarnated in the Cloud Recesses is a bit of a shock; particularly given the fact that he's in the perfect position to witness the exact effects the fallout of his bad choices have on the only true friend he ever had. Struck by guilt, he's determined to do right for once, and find a way to make things better for Lan Xichen. </p><p>A task which is significantly complicated by the fact that he wasn't actually reborn as a human. Instead he's… <i>a cockroach?!</i> </p><p>Can Jin Guangyao help Lan Xichen, despite being roach-ified? </p><p>(…And <i>why on earth</i> does it look like that big, hairy spider glowering at him from the corner across the Hanshi is trying to sharpen a tiny stick into a <i>sabre?</i>)</p>",
          //     rating: "General Audiences",
          //     adult: false,
          //     fandoms: ["陈情令 | The Untamed (TV)"],
          //     tags: {
          //       warnings: ["No Archive Warnings Apply"],
          //       characters: ["Lan Huan | Lan Xichen","Meng Yao | Jin GuangyaoNie", "Mingjue"],
          //       relationships: ["3ZUN","Lan Huan | Lan Xichen/Meng Yao | Jin Guangyao/Nie Mingjue"],
          //       additional: ['Mourning', 'Reincarnation', 'lxc/jgy/nmj (past)', 'Crack Treated Seriously'],
          //     },
          //     authors: [{username: "Xygenscenic", pseud: "Xygenscenic"}],
          //     language: "English",
          //     words: 3018,
          //     chapters: {
          //       published: 1,
          //       total: 1,
          //     },
          //     series: [],
          //     complete: true,
          //     stats: {
          //       bookmarks: 3,
          //       comments: 13,
          //       kudos: 29,
          //       hits: 318,
          //     },
          //   },
          //   {
          //     id: "31040711",
          //     title: "Bugyao and Xichen",
          //     category: "M/M",
          //     publishedAt: "02 May 2021",
          //     summary: '<p>Even reincarnated as a tiny bug, Er-Ge will love and care for his A-Yao and give him the best life possible.</p>',
          //     rating: "Not Rated",
          //     adult: true,
          //     fandoms: "陈情令 | The Untamed (TV)",
          //     tags: {
          //       warnings: ["Creator Chose Not To Use Archive Warnings"],
          //       characters: ['Lan Huan | Lan Xichen', 'Meng Yao | Jin Guangyao'],
          //       relationships: ['Lan XiChen/Jin GuangYao'],
          //       additional: ['Fanart'],
          //     },
          //     authors: "Anonymous",
          //     language: "English",
          //     words: 0,
          //     chapters: {
          //       published: 1,
          //       total: 1,
          //     },
          //     series: [],
          //     complete: true,
          //     stats: {
          //       bookmarks: 5,
          //       comments: 6,
          //       kudos: 70,
          //       hits: 582,
          //     },
          //   }
          // ],
          

        });
      });
  
    });