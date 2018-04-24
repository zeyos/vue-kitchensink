<template>
  <div id="login">
    <nav class="panel">
      <p class="panel-heading">
        <b-icon icon="lock"></b-icon> Login
      </p>
      <div class="panel-block">
        <form @submit="login">
          <b-field label="Name" :type="fieldType" :message="errorMsg">
            <b-input v-model="username"></b-input>
          </b-field>
          <b-field label="Password" :type="fieldType">
            <b-input v-model="password" type="password"></b-input>
          </b-field>
          <button type="submit" class="button is-medium is-primary">
            Login
          </button>
          <b-loading :active="isLoading"></b-loading>
        </form>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      username: '',
      password: '',
      isLoading: false,
      errorMsg: ''
    }
  },
  computed: {
    fieldType() {
      if (this.errorMsg != '') {
        return 'is-danger';
      }
    }
  },
  methods: {
    login(evt) {
      evt.preventDefault();

      this.isLoading = true;
      this.$http.post('https://cloud.zeyos.com/devdemo/auth/v1/login', {
        name: this.username,
        password: this.password,
        identifier: 'timetracker',
        appsecret: 'e511eabd1ffc3de975956dfd855ff98ddee8351a'
      })
      .then(
        // Success
        response => {
          this.isLoading = false;

          this.$emit('login', response.body);
        },
        // Failure
        response => {
          this.isLoading = false;

          if (response.status === 401) {
            this.errorMsg = 'Invalid username or password';
          } else {
            this.errorMsg = 'An unknown error occured';
          }
        }
      );
    }
  }
}
</script>

<style lang="scss" scoped>
  #login {
    max-width: 400px;
    margin: 50px auto 0 auto;

    form {
      width: 100%;
    }
  }
</style>
