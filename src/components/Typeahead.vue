<template>
  <div class="typehead">
    <input
      :type="type"
      :name="name"
      v-model="query"
      autocomplete="off"
      class="form-control"
      @keydown.down="down"
      @keydown.up="up"
      @keydown.enter.stop.prevent="hit"
      @keydown.esc="reset"
      @blur="reset"
      @input="update"
    />

    <ul v-show="hasItems" class="list-unstyled">
      <li v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
        <span v-text="item.text"></span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'ui-typeahead',
    props: {
      url: 'String',
      type: 'String',
      name: 'String',
      value: 'String'
    },
    data () {
      return {
        items: [],
        query: this.value,
        current: -1,
        loading: false,
        limit: 5,
        minChars: 1,
      }
    },
    computed: {
      hasItems () {
        return this.items.length > 0
      }
    },

    methods: {
      update () {
        if (!this.query) {
          return this.reset();
        }

        if (this.minChars && this.query.length < this.minChars) {
          return;
        }

        this.loading = true;

        this.fetch()
          .then(response => response.json())
          .then((response) => {
            if (response && this.query) {
              this.items = this.limit ? response.slice(0, this.limit) : response;
              this.current = -1;
              this.loading = false;
            }
          });
      },
      fetch () {
        let url = this.url;
        url += (url.indexOf('?') === -1 ? '?' : '&') + 'q=' + encodeURIComponent(this.query);

        return fetch(url);
      },
      hit (e) {
        if (this.current !== -1) {
          this.value = this.items[this.current].text;
          this.reset();
        }
      },
      reset () {
        this.items = [];
        this.query = this.value;
        this.loading = false;
      },
      down () {
        if (this.current < this.items.length - 1) {
          this.current++;
        } else {
          this.current = -1;
        }
      },
      up () {
        if (this.current > 0) {
          this.current--;
        } else if (this.current === -1) {
          this.current = this.items.length - 1;
        } else {
          this.current = -1;
        }
      },
      setActive (index) {
        this.current = index
      },
      activeClass (index) {
        return {
          active: this.current === index
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .typehead {
    padding: 0;
    border: none;
    position: relative;

    ul {
      width: 100%;
      max-height: 350px;
      overflow-y: auto;
      margin-top: .125rem 0 0;
      position: absolute;
      z-index: 999;
      box-shadow: 0 .5rem 1rem rgba(0,0,0,.15);
      border-radius: 5px;
      border: 1px solid #ced4da;

      &>li {
        background-color: #fff;
        border-bottom: 1px solid rgba(0,0,0,.125);
        display: block;
        padding: .25rem 1rem;
        position: relative;
        cursor: pointer;

        &:last-child {
          border: none;
        }

        &.active,
        &:hover {
          color: #fff;
          background-color: #007bff;
        }
      }
    }
  }
</style>
