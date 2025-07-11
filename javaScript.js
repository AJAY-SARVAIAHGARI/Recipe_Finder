function toggleFavorite(id) {
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const index = favorites.indexOf(id);
      if (index === -1) {
        favorites.push(id);
      } else {
        favorites.splice(index, 1);
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
      renderFavorites();
    }

    function isFavorite(id) {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      return favorites.includes(id);
    }

    function renderFavorites() {
      document.querySelectorAll(".favorite-btn").forEach(btn => {
        const id = btn.getAttribute("data-id");
        btn.classList.toggle("active", isFavorite(id));
        btn.innerText = isFavorite(id) ? "★" : "☆";
      });
    }

    async function searchRecipes() {
      const query = document.getElementById("searchInput").value;
      const container = document.getElementById("recipeContainer");
      const loader = document.getElementById("loader");
      container.innerHTML = "";
      loader.style.display = "block";
      try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`);
        const data = await res.json();
        loader.style.display = "none";
        container.innerHTML = "";
        if (!data.meals) {
          container.innerHTML = `<p>No recipes found for "${query}".</p>`;
          return;
        }
        data.meals.forEach(meal => {
          const mealDiv = document.createElement("div");
          mealDiv.classList.add("recipe");
          mealDiv.innerHTML = `
            <button class="favorite-btn" data-id="${meal.idMeal}" onclick="toggleFavorite('${meal.idMeal}')">☆</button>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <h3>${meal.strMeal}</h3>
            <a href="https://www.themealdb.com/meal.php?c=${meal.idMeal}" target="_blank">View Recipe</a>
          `;
          container.appendChild(mealDiv);
        });
        renderFavorites();
      } catch (error) {
        loader.style.display = "none";
        container.innerHTML = `<p>Error fetching recipes. Please try again.</p>`;
        console.error(error);
      }
    }
