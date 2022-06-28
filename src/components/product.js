function html(strings, ...values) {
  let str = '';
  strings.forEach((string, i) => {
      str += string + (values[i] || '');
  });
  return str;
}

export default {
  name: 'Card',
  props: {
    id: null,
    image: '',
    title: '',
    description: '',
  },

  handleLoad(e) {
    e.target.parentNode.querySelector('.placeholder').classList.add('fade');
  },

  render() {
    const template = document.createElement('div');
    template.innerHTML = html`
      <section class="card">
        <header>
          <figure>
            <div class="placeholder" style="background-image: url(http://localhost:9000/image/24/${this.props.image})"></div>
            <img
              alt="${this.props.title}"
              src="http://localhost:9000/image/620/${this.props.image}"
              loading="lazy"
              width="1280" height="720">
          </figure>
        </header>
        <main>
          <h1>${this.props.title}</h1>
          <p>${this.props.description}</p>
        </main>
      </section>
    `;
    const card = template.querySelector('.card');
    card.querySelector("img").addEventListener('load', this.handleLoad);
    return card;
  }
};