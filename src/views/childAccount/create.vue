<template>
  <account-detail :is-edit='false'></account-detail>
</template>

<script>
import AccountDetail from './components/accountDetail'

export default {
  name: 'createAccount',
  components: { AccountDetail }
}
</script>

