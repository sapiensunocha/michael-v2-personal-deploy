 
if (!self.define) {
  let e,
    a = {};
  const c = (c, s) => (
    (c = new URL(c + ".js", s).href),
    a[c] ||
      new Promise((a) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = c), (e.onload = a), document.head.appendChild(e);
        } else (e = c), importScripts(c), a();
      }).then(() => {
        const e = a[c];
        if (!e) throw new Error(`Module ${c} didn’t register its module`);
        return e;
      })
  );
  self.define = (s, i) => {
    const n =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (a[n]) return;
    const t = {};
    const r = (e) => c(e, n),
      f = { module: { uri: n }, exports: t, require: r };
    a[n] = Promise.all(s.map((e) => f[e] || r(e))).then((e) => (i(...e), t));
  };
}
define(["./workbox-1bb06f5e"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "/192x192.png", revision: "3c25043dbb647db23e121e512d1aabb5" },
        { url: "/256x256.png", revision: "2db6e82089224b0d2403e96261e034a0" },
        { url: "/512x512.png", revision: "b34a1a637259d900657fb0b7f3374a66" },
        {
          url: "/Artboard 1.png",
          revision: "43d7af08fe68c82823806132fe2636f1",
        },
        {
          url: "/_next/app-build-manifest.json",
          revision: "c0bf8b6698d5fb2ae8161bba6277779d",
        },
        {
          url: "/_next/static/chunks/0e762574-5d9642d4dca187b4.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/1517-253ed53da583570d.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/2651-5a162ff3560dfd80.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/2766-db55c9099cda67c6.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/3096-60539678dcb021ba.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/3448-907fc588818d0f59.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/3478-0a6f45f6e8b06b5a.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/3d47b92a-0c18220f38ff3dcf.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/4046-8d0424e6c65946e3.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/4775-a4f315c0d44cd4a0.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/479ba886-07eebf17bc180412.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/4bd1b696-abe689bc71c3a57e.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/4e6af11a-39608dc5d9a8d3c5.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/52ab8b6c-4d99f8de878cc3e4.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/53c13509-db40719517e0a4ed.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/547-0a0b5090fb01d010.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/5565-8be8802500f5105a.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/619edb50-d83943eeb7cfd1f2.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/6946-221bacd5ee142d13.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/7406-5f08e2185b9ff978.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/7527-afebb6edd6cb6896.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/7931-3588cb06ed377eba.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/8173-cc4d1fcfee3f733a.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/8181-0ebbdee83aed5d61.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/8641-eafa280319675b34.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/8e1d74a4-b529b45fab21fe0a.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/9007-6ab1f06bc45b89ab.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/94730671-5a0c5a7dea4686bd.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/9968-fbb6288835c8439f.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/9c4e2130-b1e34c05a2c01264.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-c810fccc70a10269.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/app/api/alert-ai/route-8fdbab7c0377e458.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/app/api/examine-file/route-abda5124f4a43a87.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/app/api/examine-pdf/route-485b346fa87b5f13.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/app/api/examine-text/route-1f2dacc4da5e65d4.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/app/api/examine-video/route-733ced87b713a5b6.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/app/api/summary-ai/route-bd1e836d5e544b6c.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/app/api/translation/route-1798b2d01a878502.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/app/dashboard/page-bb2d10f077028c80.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/app/home/page-efab6dd17d9c5cb7.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/app/language/page-d7ec07796eaa33a9.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/app/layout-4e8dee3d89c5a438.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/app/map/page-fc409833213fda39.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/app/not-found-73fe02806500ba7e.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/app/notifications/page-e893d13d76996d76.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/app/page-8cb32db7cb86faa3.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/app/register/page-4c38e2b0e83bc006.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/app/signin/page-7e283ffe045b052a.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/app/success/page-56f937fc0fcdf0a9.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/app/u/profile/page-205de7a4537aca83.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/app/upload/page-86882d2b922356d6.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/app/videos/page-68ca5f8da210992b.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/app/welcome/page-045a0d35e8233644.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/c916193b-7587413641f978eb.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/e34aaff9-3fa730c716afc671.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/e8686b1f-f4f91cc7f410c8a9.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/eec3d76d-de8d998a3d1b8784.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/f7333993-1e5d0abd5227ab15.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/f8025e75-36bdfbef874e773c.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/f97e080b-8bbbbf7a228dc721.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/fc2f6fa8-7d586a1dec98e882.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/framework-3cad510ad31f1bdb.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/main-9023d5ea6feebaa7.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/main-app-c262d735608565f2.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/pages/_app-d45f2192d73b89aa.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/pages/_error-c29de8be09f438d8.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/reactPlayerDailyMotion.30718ccbf6460fb2.js",
          revision: "30718ccbf6460fb2",
        },
        {
          url: "/_next/static/chunks/reactPlayerFacebook.a6efa1f6571a8634.js",
          revision: "a6efa1f6571a8634",
        },
        {
          url: "/_next/static/chunks/reactPlayerFilePlayer.0be4ec0cd0013294.js",
          revision: "0be4ec0cd0013294",
        },
        {
          url: "/_next/static/chunks/reactPlayerKaltura.d3f5d09c6b21102b.js",
          revision: "d3f5d09c6b21102b",
        },
        {
          url: "/_next/static/chunks/reactPlayerMixcloud.cb29069554427244.js",
          revision: "cb29069554427244",
        },
        {
          url: "/_next/static/chunks/reactPlayerMux.6142fbeb4b561e77.js",
          revision: "6142fbeb4b561e77",
        },
        {
          url: "/_next/static/chunks/reactPlayerPreview.ad8b8c68923a2503.js",
          revision: "ad8b8c68923a2503",
        },
        {
          url: "/_next/static/chunks/reactPlayerSoundCloud.775c43666f785cbf.js",
          revision: "775c43666f785cbf",
        },
        {
          url: "/_next/static/chunks/reactPlayerStreamable.60f8a628246a51d4.js",
          revision: "60f8a628246a51d4",
        },
        {
          url: "/_next/static/chunks/reactPlayerTwitch.8021b47fe959837e.js",
          revision: "8021b47fe959837e",
        },
        {
          url: "/_next/static/chunks/reactPlayerVidyard.e2e6a65bdaea3e52.js",
          revision: "e2e6a65bdaea3e52",
        },
        {
          url: "/_next/static/chunks/reactPlayerVimeo.98a1d276c092bbf8.js",
          revision: "98a1d276c092bbf8",
        },
        {
          url: "/_next/static/chunks/reactPlayerWistia.abfa57915acfaea8.js",
          revision: "abfa57915acfaea8",
        },
        {
          url: "/_next/static/chunks/reactPlayerYouTube.20ae656c5cf51217.js",
          revision: "20ae656c5cf51217",
        },
        {
          url: "/_next/static/chunks/webpack-ff52fd2b93fd24c3.js",
          revision: "hkgTqCcTaZXe69MATNGgf",
        },
        {
          url: "/_next/static/css/0acef4df005bbe6c.css",
          revision: "0acef4df005bbe6c",
        },
        {
          url: "/_next/static/css/34cc1b5c45124372.css",
          revision: "34cc1b5c45124372",
        },
        {
          url: "/_next/static/hkgTqCcTaZXe69MATNGgf/_buildManifest.js",
          revision: "942af9b01359ff6a7d076ac841e709bc",
        },
        {
          url: "/_next/static/hkgTqCcTaZXe69MATNGgf/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/media/569ce4b8f30dc480-s.p.woff2",
          revision: "ef6cefb32024deac234e82f932a95cbd",
        },
        {
          url: "/_next/static/media/747892c23ea88013-s.woff2",
          revision: "a0761690ccf4441ace5cec893b82d4ab",
        },
        {
          url: "/_next/static/media/93f479601ee12b01-s.p.woff2",
          revision: "da83d5f06d825c5ae65b7cca706cb312",
        },
        {
          url: "/_next/static/media/all.13d44567.png",
          revision: "e44c7d4317b466c5175658353cceda99",
        },
        {
          url: "/_next/static/media/ba015fad6dcf6784-s.woff2",
          revision: "8ea4f719af3312a055caf09f34c89a77",
        },
        {
          url: "/_next/static/media/cyclone1.1a4dde35.png",
          revision: "fc2fd7765b9a5b7d1356c785e3cb80a6",
        },
        {
          url: "/_next/static/media/drought1.4353e425.png",
          revision: "ad07a03d089061ec526657b141e7840e",
        },
        {
          url: "/_next/static/media/earthquake1.7d69f09c.png",
          revision: "f3f420c97e946411693d6804722ec24c",
        },
        {
          url: "/_next/static/media/fighterFighter.2759a53a.png",
          revision: "a32aa7cd33b8d837bf63d8a963446e83",
        },
        {
          url: "/_next/static/media/flood1.ed6ec0fe.png",
          revision: "3b5ac3a1f4eb7e1a01e6f041ff39e159",
        },
        {
          url: "/_next/static/media/logoMichael.c3e853fb.png",
          revision: "c53bfbc009f49be38e62bfad372cb1b3",
        },
        {
          url: "/_next/static/media/logowdg12.08.22.e50a2caf.png",
          revision: "44f0513afc2a798a96860e6b8b1152c5",
        },
        {
          url: "/_next/static/media/michaelicon.3df0f624.png",
          revision: "0b126743d73ece54e8a9dc1871df391f",
        },
        {
          url: "/_next/static/media/natural1.e2c0c2b2.png",
          revision: "48a5a6fe04d70a25122f380e30bc8577",
        },
        {
          url: "/_next/static/media/newlogo.6897cae2.png",
          revision: "c000101b2583d3e3d0de12df2d9dd9f9",
        },
        {
          url: "/_next/static/media/politic1.adbb1cae.png",
          revision: "2cbda000119037d3b58cc8e12bfafd82",
        },
        {
          url: "/_next/static/media/strat1.c2e29fe5.png",
          revision: "e2f878dee94d11960ab4d6409ac26ff1",
        },
        {
          url: "/_next/static/media/tech1.cd40d634.png",
          revision: "5875d78376d74c819c6c5071623aaa44",
        },
        {
          url: "/_next/static/media/welcomeImg.225b3a24.jpeg",
          revision: "ed9829c3cb6c798d8dd0d0b506280085",
        },
        {
          url: "/_next/static/media/wildfire.b0488d71.png",
          revision: "f93743e5ea6127f8e706b7c1dee453aa",
        },
        { url: "/file.svg", revision: "d09f95206c3fa0bb9bd9fefabfd0ea71" },
        { url: "/globe.svg", revision: "2aaafa6a49b6563925fe440891e32717" },
        {
          url: "/icons/Development.png",
          revision: "6591e1d1785f09ac471190335f63b55e",
        },
        {
          url: "/icons/Naturel.png",
          revision: "ae289755a07d3cf40e087135acdfec75",
        },
        {
          url: "/icons/Political.png",
          revision: "4204d9b13de616a4b3fec390d90b596e",
        },
        {
          url: "/icons/Tech.png",
          revision: "4d2b725f05dd9d42322d3dc7486a6a80",
        },
        {
          url: "/icons/chatIcon.png",
          revision: "4889c462eb605e314dd2cea13cb6d585",
        },
        {
          url: "/icons/circle.png",
          revision: "2c2d4d63e26e668fa7ee8bac95b8f2df",
        },
        {
          url: "/icons/cyclone1.png",
          revision: "0d7ef424421d37f7690ad42128fdac5b",
        },
        {
          url: "/icons/demonstration.png",
          revision: "942217078e3a9c4555384a5cde4c6f0b",
        },
        {
          url: "/icons/demonstrations.png",
          revision: "01f44b8d5b12f3445ce3e92c5c4e6ff0",
        },
        {
          url: "/icons/disaster.png",
          revision: "bbdfca7b8ceea99ac1dc1714fb38e072",
        },
        {
          url: "/icons/drought.png",
          revision: "cc899f79ab207f2c016a41365183d64d",
        },
        {
          url: "/icons/earthquake.png",
          revision: "300c2b984865d3d682bd9977a2eb8000",
        },
        {
          url: "/icons/fire.png",
          revision: "dcba3bb3ed566f1464dd70a4d8f654fa",
        },
        {
          url: "/icons/flood.png",
          revision: "a2fc50c3f3bc7caf0e667ca3d28aae00",
        },
        {
          url: "/icons/logoMichael.png",
          revision: "c53bfbc009f49be38e62bfad372cb1b3",
        },
        {
          url: "/icons/mapIcon.png",
          revision: "352c68af35de6d9894ac3e653f064451",
        },
        {
          url: "/icons/michaelicon.png",
          revision: "0b126743d73ece54e8a9dc1871df391f",
        },
        {
          url: "/icons/natural-gas.png",
          revision: "d9029a66939f446c566c204ca85aa586",
        },
        {
          url: "/icons/natural1.png",
          revision: "88960def6001137a1920c3eedb0807bf",
        },
        {
          url: "/icons/newlogo.png",
          revision: "c000101b2583d3e3d0de12df2d9dd9f9",
        },
        {
          url: "/icons/notfound.svg",
          revision: "3ead8f0e7fade5647ee36e27d95456ff",
        },
        {
          url: "/icons/politic1.png",
          revision: "4204d9b13de616a4b3fec390d90b596e",
        },
        {
          url: "/icons/profile.png",
          revision: "2e347d4f0eae7dcbbac284cae51d4d9f",
        },
        {
          url: "/icons/strat.png",
          revision: "6591e1d1785f09ac471190335f63b55e",
        },
        {
          url: "/icons/strat1.png",
          revision: "e5d7825346ac053a42735fb8153abd26",
        },
        {
          url: "/icons/tech1.png",
          revision: "940ad03f6fefec225777d952fab5ee53",
        },
        {
          url: "/icons/translate.png",
          revision: "0b7be752b1e96db5a248e2c67384e006",
        },
        {
          url: "/icons/volcano.png",
          revision: "ef94172ecab2265b7dc83ff3b545089c",
        },
        {
          url: "/icons/wildfire.png",
          revision: "b594b20ee776d03bea9c819a5b6d9543",
        },
        { url: "/logoicon.png", revision: "43d7af08fe68c82823806132fe2636f1" },
        {
          url: "/logowdg12.08.22.png",
          revision: "44f0513afc2a798a96860e6b8b1152c5",
        },
        { url: "/manifest.json", revision: "0695671cb431a7dae4d120899f58e533" },
        {
          url: "/michaelicon.png",
          revision: "0b126743d73ece54e8a9dc1871df391f",
        },
        { url: "/next.svg", revision: "8e061864f388b47f33a1c3780831193e" },
        { url: "/vercel.svg", revision: "c0af2f507b369b085b35ef4bbe3bcf1e" },
        { url: "/window.svg", revision: "a2760511c65806022ad20adf74370ff3" },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: a,
              event: c,
              state: s,
            }) =>
              a && "opaqueredirect" === a.type
                ? new Response(a.body, {
                    status: 200,
                    statusText: "OK",
                    headers: a.headers,
                  })
                : a,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const a = e.pathname;
        return !a.startsWith("/api/auth/") && !!a.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET",
    );
});
