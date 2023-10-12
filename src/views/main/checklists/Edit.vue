<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        Editar lista de chequeo
                    </div>
                    <div class="card-body">
                        <div class="alert alert-danger" v-show="Object.keys(errors).length > 0 ? true : false">
                            <li v-for="(error, index) in errors" :key="index">
                                {{ error[0] }}
                            </li>
                        </div>
                        <div class="form-group">
                            <label for="">Nombre</label>
                            <input type="text" class="form-control" v-model="checklist.name" maxlength="30">
                        </div>
                        <div>
                            <button @click="updateChecklist" 
                                :disabled="saving"
                                class="btn btn-primary btn-sm mr-1">
                                <div class="spinner-border spinner-border-sm" role="status" 
                                    v-if="saving">
                                    <span class="sr-only">Loading...</span>
                                </div>
                                <i class="fa fa-save" v-else></i>
                                Actualizar
                            </button>
                            <router-link class="btn btn-danger btn-sm" :to="{ name: 'checklists.index' }"><i class="fa fa-times-circle"></i> Cancelar</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 mt-2">
                <div class="card">
                    <div class="card-header">
                        Grupos
                    </div>
                    <div class="card-body">
                        <div class="form-inline">
                            <div class="form-group mr-sm-3 mb-2">
                                <input type="text" class="form-control" placeholder="Nombre grupo" v-model="newGroup.name">
                            </div>
                            <button type="submit" class="btn btn-primary mb-2 mr-1" @click="saveGroup">
                                <i class="fa fa-plus"></i> Agregar
                            </button>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Nombre</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="checklist_group in checklist.checklist_groups" :key="checklist_group.id">
                                        <td>{{ checklist_group.name }}</td>
                                        <td>
                                            <button class="btn btn-danger btn-sm" title="Eliminar" 
                                                @click="deleteGroup(checklist_group)" :disabled="checklist_group.deleting">
                                                <div class="spinner-border spinner-border-sm" role="status" 
                                                    v-if="checklist_group.deleting">
                                                    <span class="sr-only">Loading...</span>
                                                </div>
                                                <i class="fa fa-trash-alt" v-else></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 mt-2">
                <div class="card">
                    <div class="card-header">
                        Ítems
                    </div>
                    <div class="card-body">
                        <div class="form-inline">
                            <div class="form-group mr-sm-3 mb-2">
                                <input type="text" class="form-control" placeholder="Descripción" v-model="newItem.description">
                            </div>
                            <div class="form-group mr-sm-3 mb-2">
                                <select class="form-control" v-model="newItem.checklist_group_id">
                                    <option value="">Seleccione grupo</option>
                                    <option :value="checklist_group.id" v-for="checklist_group in checklist.checklist_groups" :key="'list-' + checklist_group.id">
                                        {{ checklist_group.name }}
                                    </option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary mb-2 mr-1" @click="saveItem">
                                <i class="fa fa-plus"></i> Agregar
                            </button>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Descripción</th>
                                    <th>Grupo</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="checklist_item in checklist.checklist_items" :key="'item-' + checklist_item.id">
                                        <td>{{ checklist_item.description }}</td>
                                        <td>{{ checklist_item.checklist_group.name }}</td>
                                        <td>
                                            <button class="btn btn-danger btn-sm" title="Eliminar" 
                                                @click="deleteItem(checklist_item)" :disabled="checklist_item.deleting">
                                                <div class="spinner-border spinner-border-sm" role="status" 
                                                    v-if="checklist_item.deleting">
                                                    <span class="sr-only">Loading...</span>
                                                </div>
                                                <i class="fa fa-trash-alt" v-else></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { VueLoading } from 'vue-loading-template'
    export default {
        name: 'checklists.edit',
        components: {
            VueLoading
        },
        created () {
            this.getChecklist()
        },
        data() {
            return {
                checklist: {
                    name: '',
                    checklist_items: [],
                },
                saving: false,
                errors: {},
                newGroup: {
                    name: '',
                },
                newItem: {
                    description: '',
                    checklist_group_id: '',
                },
            }
        },
        methods: {
            getChecklist () {
                this.$http.get(`checklists/${ this.$route.params.id }/edit`).then( response => {
                    this.checklist = response.data
                    
                    this.checklist.checklist_items.forEach(checklist_item => {
                        this.$set(checklist_item, 'deleting', false)  
                    })

                    this.checklist.checklist_groups.forEach(checklist_group => {
                        this.$set(checklist_group, 'deleting', false)  
                    })
                })
            },
            save () {
                this.saving = true
                this.$http.put(`checklists/${ this.$route.params.id }`, this.checklist).then( response => {
                    this.$toastr.success('Lista de chequeo actualizada')
                    this.$router.push({ name: 'checklists.index' })
                    this.errors = {}
                }).catch(error => {
                    this.saving = false
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
                })
            },
            saveGroup () {
                this.$http.post(`checklists/${ this.$route.params.id }/add-group`, this.newGroup).then( response => {
                    this.getChecklist()
                    this.newGroup.name = ''
                    this.$toastr.success('Grupo agregado')
                    this.errors = {}
                }).catch(error => {
                    this.saving = false
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
                })
            },
            deleteGroup (group) {
                group.deleting = true
                this.$http.delete(`checklists/${ group.id }/delete-group`).then( response => {
                    this.getChecklist()
                    this.$toastr.success('´Grupo eliminado')
                    this.errors = {}
                    group.deleting = false
                }).catch(error => {
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
                })
            },
            saveItem () {
                this.$http.post(`checklists/${ this.$route.params.id }/add-item`, this.newItem).then( response => {
                    this.getChecklist()
                    this.newItem = {
                        description: '',
                        checklist_group_id: '',
                    }
                    this.$toastr.success('Ítem agregado')
                    this.errors = {}
                }).catch(error => {
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
                })
            },
            deleteItem (item) {
                item.deleting = true
                this.$http.delete(`checklists/${ item.id }/delete-item`, this.newItem).then( response => {
                    this.getChecklist()
                    this.$toastr.success('Ítem eliminado')
                    this.errors = {}
                    item.deleting = false
                }).catch(error => {
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
                })
            },
            updateChecklist () {
                this.saving = true
                this.$http.put(`checklists/${ this.checklist.id }/update-checklist`, { name: this.checklist.name }).then( response => {
                    this.getChecklist()
                    this.$toastr.success('Lista de chequeo actualizada')
                    this.errors = {}
                    this.saving = false
                }).catch(error => {
                    this.saving = false
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
                })
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>