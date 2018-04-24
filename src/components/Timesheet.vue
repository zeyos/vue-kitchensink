<template>
  <div>
    <button class="button is-medium is-primary" @click="refresh">
      <b-icon icon="refresh"></b-icon>
      <span>Refresh</span>
    </button>

    <button class="button is-medium is-success" @click="addNew">
      <b-icon icon="plus"></b-icon>
      <span>Add new</span>
    </button>

    <b-modal :active.sync="showPopup" has-modal-card>
      <popup @save="refresh"></popup>
    </b-modal>

    <b-table
        :data="data"
        :striped="true"
        :loading="isLoading"
        :mobile-cards="true">

        <template slot-scope="props">
          <b-table-column field="id" label="ID" width="40" numeric>
              {{ props.row.Id }}
          </b-table-column>

          <b-table-column field="name" label="Action Name">
              {{ props.row.Name }}
          </b-table-column>

          <b-table-column field="ticket" label="Ticket Name">
              {{ props.row.Ticket }}
          </b-table-column>

          <b-table-column field="date" label="Date" centered>
              <span class="tag is-success">
                  {{ new Date(props.row.Date * 1000).toLocaleDateString() }}
              </span>
          </b-table-column>

          <b-table-column field="options" label="Options" centered>
              <button class="button is-small is-danger" @click="remove(props.row.Id)">
                <b-icon icon="delete"></b-icon>
              </button>
          </b-table-column>
        </template>
    </b-table>
  </div>
</template>

<script>
import NewEntry from './NewEntry'

export default {
  name: 'Timesheet',
  data () {
    return {
      isLoading: false,
      showPopup: false,
      data: []
    }
  },
  components: {
    popup: NewEntry
  },
  computed: {
    session() {
      return this.$root.session;
    }
  },
  mounted() {
    this.refresh();
  },
  methods: {
    refresh() {
      this.isLoading = true;
      this.$http.post('https://cloud.zeyos.com/devdemo/api/v1/actionsteps', {
        fields: {
          Id: 'ID',
          Name: 'name',
          Effort: 'effort',
          Username: 'assigneduser.name',
          Ticket: 'ticket.name',
          'Date': 'date'
        },
        filters: {
          status: {'!=': 2},
          1: ['OR', {assigneduser: this.session.user}, {owneruser: this.session.user}]
        },
        sort: [
          '-date'
        ],
        limit: 10
      })
      .then(
        // Success
        response => {
          this.isLoading = false;
          this.data = response.body;
        },
        // Failure
        response => {
          this.isLoading = false;

          this.$toast.open({
              duration: 5000,
              message: typeof response.body === 'string' && response.body != '' ? response.body : 'Request failed (Status ' + response.status + ')',
              position: 'is-top',
              type: 'is-danger'
          })
        }
      );
    },

    remove(Id) {
      this.$dialog.confirm({
         message: 'Do you really want to remove this entry?',
         onConfirm: () => {
           this.isLoading = true;
           this.$http.patch('https://cloud.zeyos.com/devdemo/api/v1/actionsteps/' + Id, JSON.stringify({
             status: 2
           }))
           .then(
             // Success
             response => {
               this.isLoading = false;
               this.refresh();
             },
             // Failure
             response => {
               this.isLoading = false;

               this.$toast.open({
                   duration: 5000,
                   message: typeof response.body === 'string' && response.body != '' ? response.body : 'Request failed (Status ' + response.status + ')',
                   position: 'is-top',
                   type: 'is-danger'
               })
             }
           );
         }
       });
    },
    addNew() {
      this.showPopup = true;
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
