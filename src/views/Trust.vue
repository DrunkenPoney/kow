<template>
  <div v-if="error != null">
    ERROR: {{error.message}}
  </div>
  <div v-else-if="loading">
    loading...
  </div>
  <div v-else-if="voted">
    VOTED!
  </div>
  <div v-else>
    <div v-for="(vote, id) in votes" :key="id"
         class="p-grid highlight p-my-0 p-py-1 p-mx-0">
      <div class="p-col-12 p-md-3 p-xl-2 p-pl-3">
        [#{{ vote.zone }}][{{ vote.guild }}]{{ vote.member }}
      </div>
      <div class="p-col-11 p-offset-1 p-md-9 p-xl-10 p-md-offset-0 p-mr-0 p-my-0">
        <div class="p-formgroup-inline">
          <div v-for="(label, value) in values" :key="value"
               class="p-field-radiobutton">
            <RadioButton :name="`rb-${id}`"
                         :id="`rb-${id}-${value}`"
                         :value="value"
                         v-model="vote.vote" />
            <label :for="`rb-${id}-${value}`"
                   v-text="label" />
          </div>
        </div>
      </div>
    </div>

    <div class="button-wrapper">
        <Button label="Submit" @click="onSubmit" />
    </div>
  </div>

  <Dialog header="Username" v-model:visible="showDialog"
          :closeOnEscape="false"
          :modal="true"
          :closable="false">
    <div class="p-fluid">
      <div class="p-field">
        <label for="username">Enter your in-game name:</label>
        <InputText id="username" type="text" v-model="username" autofocus placeholder="e.g. George" />
      </div>
    </div>
    <template #footer>
      <Button label="Submit"
              v-model="username"
              @click="setName"/>
    </template>
  </Dialog>
</template>

<script lang="js">
import { defineComponent } from 'vue'
import cookies from 'js-cookie'
import { App, Credentials } from 'realm-web'
import { APP_ID } from '@/modules/constants'
import RadioButton from 'primevue/radiobutton'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'

export default defineComponent({
  name: "Trust",
  components: { RadioButton, Button, Dialog, InputText },
  data() {
    return {
      voted: cookies.get('voted') != null,
      loading: cookies.get('voted') != null,
      error: null,
      db: null,
      zone: 83,
      guild: 'RDx',
      votes: [],
      username: this.voter || '',
      showDialog: cookies.get('username') == null,
      values: {
        VERY_HIGH: 'Very High',
        HIGH: 'High',
        MEDIUM: 'Medium',
        LOW: 'Low',
        VERY_LOW: 'Very Low'
      },
    }
  },
  async created() {
    window.bob = this;
    try {
      if (!this.voted) {
        let user = this.app.currentUser
        if (user == null || user.id == null) {
          user = await this.app.logIn(Credentials.anonymous())
        }
        const db = this.db = user.mongoClient('mongodb-atlas').db('kow')
        const zone = await db.collection('zones').findOne({ zone: this.zone })
        if (zone == null) throw new Error('Internal Error');
        const guild = zone.guilds.find(({tag}) => tag === this.guild)
        if (guild == null) throw new Error('Internal Error');
        let votes = []
        for (let member of guild.members) {
          votes.push({
            zone: this.zone,
            guild: this.guild,
            member,
            vote: null
          })
        }
        this.votes = window.votes = votes
      }
    } catch(err) {
      this.error = err
    } finally {
      this.loading = false
    }
  },

  computed: {
    app() { return App.getApp(APP_ID) },
    valid() { return this.votes.every(({vote}) => vote != null) },
    voter() { return cookies.get('username') }
  },

  methods: {
    async onSubmit() {
      if (this.valid) {
        this.loading = true
        try {
          await this.db.collection('votes').insertOne({
            voter: this.voter,
            votes: this.votes
          })
          cookies.set('voted', 'true', { expires: 14 })
          this.voted = true
          this.$toast.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Your vote has been submitted!',
            life: 4000
          })
        } catch (err) {
          this.error = err
        } finally {
          this.loading = false
        }
      } else {
        this.$toast.add({
          severity: 'error',
          summary: 'Vote Missing!',
          detail: 'You need to give a vote for each player.',
          life: 4000
        })
      }
    },

    setName() {
      this.username = (this.username||'').trim()
      if (this.username.replace(/\s+/g, '').length > 0) {
        cookies.set('username', this.username)
        this.showDialog = false
      } else {
        this.$toast.add({
          severity: 'error',
          summary: 'Invalid Username!',
          detail: 'Username is required and must not be empty.',
          life: 4000
        })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.highlight {
  border-bottom: 1px solid var(--surface-d);
  &:hover {
    background-color: var(--surface-b);
  }

  > :first-child {
    font-weight: bold;
  }

  .p-field-radiobutton {
    margin-bottom: 0;
  }
}
.button-wrapper {
  display: flex;
  justify-content: center;
  padding: 1em;
}
</style>