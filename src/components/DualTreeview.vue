<template>
  <div class="row">
    <div class="col-5">
      <div class="border">
        <div class="m-2">
          <input class="form-control" type="text" placeholder="Type to filter..." v-model="treeFilterUnassigned">
        </div>
        <div class="border-bottom mb-2"></div>
        <div class="treeview-wrapper m-2">
          <tree
            ref="unassignedTree"
            class="tree--small"
            :options="{ checkbox: true, checkOnSelect: true, fetchData: fetchUnassignedUrl }"
            :filter="treeFilterUnassigned"
            @node:checked="handleUnassignedChecked"
            @node:unchecked="handleUnassignedChecked" />
          </div>
        </div>
    </div>

    <div class="col-2 col-2 mt-auto mb-auto text-center">
      <button v-bind:class="buttonCssClasses(unassignedChecked)" v-on:click="handleAssignClick">
        <slot name="assign-button-content"></slot>
      </button>
      <div class="mb-3"></div>
      <button v-bind:class="buttonCssClasses(assignedChecked)" v-on:click="handleUnassignClick">
        <slot name="unassign-button-content"></slot>
      </button>
    </div>

    <div class="col-5">
      <div class="border">
        <div class="m-2">
          <input class="form-control" type="text" placeholder="Type to filter..." v-model="treeFilterAssigned">
        </div>
        <div class="border-bottom mb-2"></div>
        <div class="treeview-wrapper m-2">
          <tree
            ref="assignedTree"
            class="tree--small"
            :options="{ checkbox: true, checkOnSelect: true, fetchData: fetchAssignedUrl }"
            :filter="treeFilterAssigned"
            @node:checked="handleAssignedChecked"
            @node:unchecked="handleAssignedChecked" />
          </div>
        </div>
    </div>
  </div>
</template>

<script>
  import LiquorTree from 'liquor-tree';

  export default {
    name: 'ui-dual-treeview',
    props: {
      csrfValue: 'String',
      csrfHeaderName: 'String',
      fetchUnassignedUrl: 'String',
      fetchAssignedUrl: 'String',
      postAssignUrl: 'String',
      postUnassignUrl: 'String'
    },
    components: { LiquorTree },
    data: function () {
      return {
        options: {
          checkbox: true,
          checkOnSelect: true
        },
        treeFilterUnassigned: '',
        treeFilterAssigned: '',
        unassignedChecked: 0,
        assignedChecked: 0
      };
    },
    methods: {
      buttonCssClasses(counter) {
        return {
          'btn': 'btn',
          'disabled': counter === 0,
          'btn-secondary': counter === 0,
          'btn-primary': counter > 0
        }
      },
      handleUnassignedChecked(node) {
        node.states.checked ? this.unassignedChecked++ : this.unassignedChecked--;
      },
      handleAssignedChecked(node) {
        node.states.checked ? this.assignedChecked++ : this.assignedChecked--;
      },
      handleAssignClick() {
        postData(
          this.postAssignUrl,
          getSelectedData(this.$refs.unassignedTree),
          {
            [this.csrfHeaderName]: this.csrfValue
          }
        )
          .then(response => response.json())
          .then(response => {
            window.location.reload();
          });
      },
      handleUnassignClick() {
        postData(
          this.postUnassignUrl,
          getSelectedData(this.$refs.assignedTree),
          {
            [this.csrfHeaderName]: this.csrfValue
          }
        )
          .then(response => response.json())
          .then(response => {
            window.location.reload();
          });
      }
    }
  };

  const getSelectedData = (tree) => {
    return tree
      .findAll({ state: { checked: true } })
      .filter(item => !!item.data.type)
      .map(item => {
        return {
          id: item.data.id,
          type: item.data.type
        }
      });
  };

  const postData = (url = '', body = {}, headers = {}) => {
    return window.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...headers
      },
      body: JSON.stringify(body)
    });
  };
</script>

<style scoped>
  .treeview-wrapper {
    height: 300px;
    overflow-y: scroll;
  }
</style>
