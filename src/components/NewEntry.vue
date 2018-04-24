<template>
  <form action="">
      <div class="modal-card" id="popup">
          <header class="modal-card-head">
              <p class="modal-card-title">New entry</p>
          </header>
          <section class="modal-card-body">
              <b-field label="Select a date">
                  <b-datepicker
                      placeholder="Click to select..."
                      icon="calendar-today"
                      v-model="date">
                  </b-datepicker>
              </b-field>

              <b-field label="Start time">
                  <b-timepicker v-model="start" hour-format="24"></b-timepicker>
              </b-field>

              <b-field label="End time">
                  <b-timepicker v-model="end" hour-format="24"></b-timepicker>
              </b-field>

              <b-field label="Name">
                  <b-input v-model="name"></b-input>
              </b-field>
          </section>
          <footer class="modal-card-foot">
              <button class="button" type="button" @click="$parent.close()">Close</button>
              <button class="button is-primary" @click="save">Save</button>
          </footer>
      </div>
  </form>
</template>

<script>
export default {
  name: 'NewEntry',
  data () {
    return {
      name: '',
      start: new Date(),
      end: new Date(),
      date: new Date(),
      isLoading: false
    }
  },
  methods: {
    save(evt) {
      evt.preventDefault();

      let date = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), this.start.getHours(), this.start.getMinutes());

      let effort = this.end.getHours() * 60 + this.end.getMinutes() - this.start.getHours() * 60 + this.start.getMinutes();
      if (effort < 0) {
        effort = 24 * 60 - effort;
      }

      this.$http.put('https://cloud.zeyos.com/devdemo/api/v1/actionsteps', JSON.stringify({
        name: this.name,
        date: date.getTime() / 1000,
        assigneduser: this.$root.session.user,
        effort: effort
      }))
        .then(
          // Success
          response => {
            this.isLoading = false;
            this.$parent.close();
            this.$emit('save');
          },
          // Failure
          response => {
            this.isLoading = false;

            this.$toast.open({
                duration: 5000,
                message: typeof response.body === 'string' ? response.body : 'Request failed',
                position: 'is-top',
                type: 'is-danger'
            })
          }
      );
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
