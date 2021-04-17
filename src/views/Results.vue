<template>
  <div class="p-grid">
  </div>

  <DataTable :value="results"
             :loading="loading"
             class="p-datatable-sm"
             responsiveLayout="scroll">
    <Column field="member"
            header="Member"
            :sortable="true" />

    <Column v-for="(header, field) in columns.vote" :key="field"
            :field="`vote.${field}`"
            :header="header"
            style="text-align: center"
            :sortable="true" />

    <Column header="Rating"
            field="stats.rating"
            :sortable="true"
            style="text-align: center">
      <template #body="{data}">
        {{ data.stats.rating }}
      </template>
    </Column>
    <Column header="Favorable"
            field="stats.favorable"
            :sortable="true"
            style="text-align: center">
      <template #body="{data}">
        {{ toPercentage(data.stats.favorable) }}%
      </template>
    </Column>
    <Column header="Neutral"
            field="stats.neutral"
            :sortable="true"
            style="text-align: center">
      <template #body="{data}">
        {{ toPercentage(data.stats.neutral) }}%
      </template>
    </Column>
    <Column header="Defavorable"
            field="stats.defavorable"
            :sortable="true"
            style="text-align: center">
      <template #body="{data}">
        {{ toPercentage(data.stats.defavorable) }}%
      </template>
    </Column>
    <template #empty>
      Couldn't retrieve any data.
    </template>
  </DataTable>
</template>
<script lang="ts">

import { defineComponent } from 'vue'
import { App, Credentials } from 'realm-web'
import { APP_ID } from '@/modules/constants'
import { math } from '@/modules/utils'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { IResult, Result, ResultArray } from '@/modules/result'


export default defineComponent({
  name: 'Results',
  components: { DataTable, Column },
  data() {
    return {
      error: null as null | Error,
      results: new ResultArray(),
      loading: true,

      columns: {
        vote: {
          VERY_HIGH: 'V. H.',
          HIGH: 'H.',
          MEDIUM: 'M.',
          LOW: 'L.',
          VERY_LOW: 'V. L.',
        },
      },
    }
  },
  mounted() {
    this.refresh()
  },

  computed: {
    app() { return App.getApp(APP_ID) },
  },

  methods: {
    async refresh() {
      this.loading = true
      try {
        let user = this.app.currentUser
        if (user == null || user.id == null)
          user = await this.app.logIn(Credentials.anonymous())
        const db    = user.mongoClient('mongodb-atlas').db('kow')
        let entries = await db.collection('votes').find()
        entries     = entries.flatMap(({ votes }) => votes)

        let res: IResult | undefined
        for (let { member, vote } of entries) {
          res = this.results.get(member)
          if (res == undefined)
            this.results.push(res = new Result(member))
          res.add(vote)
        }
      } catch (err) {
        this.error = err
        this.$toast.add({
          severity: 'error',
          summary: 'Error!',
          details: err.message,
          life: 4000,
        })
      } finally {
        this.loading = false
      }
    },

    toPercentage(value: number) {
      return math.round(value * 100, 1)
    },
  },
})
</script>

<style lang="scss">
.p-column-header-content {
  justify-content: center;
}
</style>