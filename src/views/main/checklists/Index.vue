<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Listas de chequeo
                        </span>
                        <button class="btn btn-success btn-sm float-right" :disabled="!hasPermission('checklists.create')" 
                            data-toggle="modal" data-target="#createChecklistModal">
                            <i class="fa fa-plus"></i> Nuevo
                        </button>
                        <!-- Modal create checklist-->
                        <div class="modal fade" id="createChecklistModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Nueva lista de chequeo</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div class="alert alert-danger" v-show="errors">
                                        <li v-for="(error, index) in errors" :key="index">
                                            {{ error[0] }}
                                        </li>
                                    </div>
                                    <form @submit.prevent="saveChecklist()">
                                        <div class="form-group">
                                            <label for="">Nombre</label>
                                            <input type="text" class="form-control" v-model="newChecklist.name">
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <vue-loading v-if="saving" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                                    <div v-else>
                                        <button class="btn btn-primary btn-sm mr-1" @click="saveChecklist()"><i class="fa fa-save"></i> Guardar</button>
                                        <button type="button" class="btn btn-danger btn-sm" data-dismiss="modal">
                                            <i class="fa fa-times-circle"></i> Cancelar
                                        </button>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <!--Buscador-->
                        <simple-search @searching="searchChecklist" placeholder="Nombre de la lista de chequeo"/>
                        <!--Fin buscador-->
                        <vue-loading v-if="loading" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                        <div class="table-responsive" v-else style="margin-top:15px">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Nombre</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="checklist in checklists.data" :key="checklist.id">
                                        <td>{{ checklist.name }}</td>
                                        <th>
                                            <button class="btn btn-warning btn-sm" :disabled="!hasPermission('checklists.edit')" style="margin-right:3px"
                                                @click="$router.push({ name: 'checklists.edit', params: { id: checklist.id } })">
                                                <i class="fa fa-edit"></i> Editar
                                            </button>

                                            <button class="btn btn-danger btn-sm mr-1" @click="deleteChecklist(checklist.id)" :disabled="!hasPermission('checklists.destroy')">
                                                <i class="fa fa-trash-alt"></i> Eliminar
                                            </button>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="checklists" @pagination-change-page="getChecklists"></pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import hasPermission from '../_utilities/hasPermission'
    import { VueLoading } from 'vue-loading-template'
    import SimpleSearch from '../components/SimpleSearch'
    export default {
        name: 'checklists.index',
        components: {
            VueLoading, 'simple-search': SimpleSearch
        },
        mixins: [ hasPermission ],
        created () {
            this.getChecklists()
        },
        data() {
            return {
                checklists: {},
                loading: true,
                newChecklist: {
                    name: '',
                },
                saving: false,
                errors: null,
            }
        },
        methods: {
            searchChecklist (search) {
                this.loading = true
                this.getChecklists(1, search.search)
            },
            getChecklists (page = 1, search = '') {
                this.$http.get(`checklists?page=${ page }&name=${ search }`).then( response => {
                    this.checklists = response.data
                    this.loading = false
                })
            },
            deleteChecklist (checklist) {
                this.$http.delete(`checklists/${ checklist }`).then( response => {
                    this.getChecklists()
                    this.$toastr.success('Lista de chequeo eliminada')
                }).catch(() => {
                    this.$toastr.error('La lista de chequeo no se pudo eliminar')
                })
            },
            saveChecklist () {
                this.saving = true
                this.$http.post('checklists', this.newChecklist).then( response => {
                    this.getChecklists()
                    this.$toastr.success('Lista de chequeo creada')
                    this.newChecklist.name = ''
                    this.errors = null
                    this.saving = false
                }).catch(error => {
                    this.saving = false
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
                })
            }
        },
    }
</script>