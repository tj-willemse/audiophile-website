import '../styles/modern.css';
import '../styles/style.css';
import '../styles/components/header.css';
import '../styles/components/home.css';
import '../styles/components/footer.css';
import '../styles/components/about-bottom.css';
import '../styles/components/three-items-shop.css';
import '../styles/util.css';

fetch('./data.json')
  .then((response) => response.json())
  .then((data) => {
    displayProducts(data);
  })
  .catch((error) => console.error('Error fetching the JSON:', error));
