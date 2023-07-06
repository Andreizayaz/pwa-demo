import { getPosts, toCard } from "./methods.js";

const innerHeader = document.getElementById("inner-header");
innerHeader.textContent = "Welcome to PWA web app";

const footer = document.getElementById("footer");
footer.textContent = "Footer content";

const postsList = document.getElementById("posts");

const fragment = document.createDocumentFragment();

window.addEventListener("load", async () => {
  try {
    if (navigator.serviceWorker) {
      const reg = await navigator.serviceWorker.register("./sw.js");
      console.log("sever worker registered", reg);
    }
  } catch (error) {
    console.warn("sever worker failed", error);
  }

  await loadPosts();
});

const loadPosts = async () => {
  const posts = await getPosts();

  posts.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = toCard(item.title, item.body);
    fragment.appendChild(listItem);
  });

  postsList.appendChild(fragment);
};
