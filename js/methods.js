export const getPosts = async () => {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=10"
  );

  const posts = await response.json();
  return posts;
};

export const toCard = (title, text) => {
  return `
    <div class="card">
      <h3 class="card__title">${title}</h3>
      <p class="card__text">${text}</p>
    </div>`;
};
