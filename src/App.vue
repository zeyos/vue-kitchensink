<template>
  <div id="app">
    <Login v-if="!hasSession" @login="storeSession" />
    <Timesheet v-if="hasSession" />
  </div>
</template>

<script>
import Login from './components/Login'
import Timesheet from './components/Timesheet'

export default {
  name: 'App',
  components: {
    Login,
    Timesheet
  },
  computed: {
    hasSession() {
      return this.$root.hasSession;
    }
  },
  methods: {
    storeSession(session) {
      this.$root.registerSession(session);
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
