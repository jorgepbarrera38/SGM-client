<template>
    <div class="row">
        <div class="col-md-12">
            <div class="form-inline">
                <div class="form-group mr-sm-3 mb-2" v-if="showButtonForSelectGroup">
                    <select class="form-control" v-model="group_id">
                        <option :value="group.id" v-for="group in groups" :key="`group-${ group.id }`">
                            {{ group.name }}
                        </option>
                    </select>
                </div>
                <div class="form-group mr-sm-3 mb-2">
                    <input type="text" class="form-control" v-model="search" @keyup.enter="emitSearch" :placeholder="placeholder">
                </div>
                <button type="submit" class="btn btn-primary mb-2 mr-1" @click.prevent="emitSearch"><i class="fa fa-search"></i> Buscar</button>
                <button type="submit" v-if="showButtonFromFilter" title="Mostrar filtros"
                    class="btn btn-secondary mb-2" @click.prevent="emitShowFilters">
                    <i class="fa fa-filter"></i>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        showButtonForSelectGroup: {
            type: Boolean,
            default: false
        },
        showButtonFromFilter: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String
        },
        groups: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            search: '',
            group_id: '',
        }
    },
    methods: {
        emitSearch () {
            this.$emit('searching', { search: this.search, group_id: this.group_id })
        },
        emitShowFilters () {
            this.$emit('showFilters')
        }
    },
    watch: {
        groups(newValue, oldValue) {
            this.group_id = newValue.length ? newValue[0].id : ''
        }
    },
}
</script>