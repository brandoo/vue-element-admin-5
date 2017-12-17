<template>
  <article-detail :is-edit='true'></article-detail>
</template>

<script>
import editChildAccount from './components/accountDetail'

export default {
  name: 'createAccount',
  components: { editChildAccount }
}
</script>

