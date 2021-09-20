<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Mantenimientos realizados
                        </span>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="getMaintenances()">
                            <div class="form-row">
                                <div class="form-group col-md-2">
                                    <label for="">Fecha inicial</label>
                                    <input type="date" class="form-control" v-model="parameters.initial_date" required>
                                </div>
                                <div class="form-group col-md-2">
                                    <label for="">Fecha final</label>
                                    <input type="date" class="form-control" v-model="parameters.final_date" required>
                                </div>
                                <div class="form-group col-md-3">
                                    <label for="">Tipo</label>
                                    <select class="form-control" v-model="typeMaintenance">
                                        <option value="1">Mantenimientos preventivos</option>
                                        <option value="2">Otros mantenimientos</option>
                                        <option value="3">Mantenimientos generales</option>
                                    </select>
                                </div>
                                <div class="form-group col-md-2">
                                    <label for="">Grupo</label>
                                    <select class="form-control" v-model="parameters.group" :disabled="typeMaintenance == 3">
                                        <option value="">Seleccione grupo</option>
                                        <option :value="group.id" v-for="group in groups" :key="group.id">{{ group.name }}</option>
                                    </select>
                                </div>
                                <div class="form-group col-md-2">
                                    <label for="">Usuario</label>
                                    <select class="form-control" v-model="parameters.user">
                                        <option value="">Todos</option>
                                        <option :value="user.id" v-for="user in users" :key="user.id">{{ user.names }}</option>
                                    </select>
                                </div>
                                <div class="form-group col-md-1">
                                    <label for="" style="opacity:0">ALEXIS</label> <br>
                                    <button type="submit" class="btn btn-primary btn-block">
                                        <i class="fa fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                        <!-- Modal evidence -->
                        <modal-full-height :evidence="evidence" />
                    </div>
                </div>
                <vue-loading v-if="loading" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                <div class="card mt-3" v-if="!loading && maintenances.data && maintenances.data.length">
                    <div class="card-header">
                        <span class="panel-title">
                            <span v-if="typeMaintenanceSelected == 1">Mantenimientos preventivos</span>
                            <span v-if="typeMaintenanceSelected == 2">Otros mantenimientos</span>
                            <span v-if="typeMaintenanceSelected == 3">Mantenimientos generales</span>
                            <div class="float-right">
                                <button class="btn btn-success btn-sm mr-1" @click="exportReportExcel">
                                    <div class="spinner-border spinner-border-sm" role="status" v-if="downloadingExcel">
                                        <span class="sr-only">Loading...</span>
                                    </div>
                                    <i class="fa fa-file-excel" v-else></i>
                                    Exportar
                                </button>
                                <!--<button class="btn btn-danger btn-sm" @click="exportReportPdf">
                                    <div class="spinner-border spinner-border-sm" role="status" v-if="downloadingPdf">
                                        <span class="sr-only">Loading...</span>
                                    </div>
                                    <i class="fa fa-file-pdf" v-else></i>
                                    Exportar
                                </button>*-->
                            </div>
                        </span>
                    </div>
                    <div class="card-body">
                            <span v-if="maintenances.data"><strong>Total registros:</strong> {{ maintenances.total }}</span> <br>
                            <!--Mantenimientos preventivos-->
                            <div class="table-responsive" style="margin-top:15px" v-if="typeMaintenanceSelected == 1">
                                <table class="table table-hover table-sm">
                                    <thead>
                                        <th>Fecha</th>
                                        <th>Grupo</th>
                                        <th>Dispositivo</th>
                                        <th>Ubicación</th>
                                        <th>Dependencia</th>
                                        <th>Usuario</th>
                                        <th></th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="preventiveMaintenance in maintenances.data" :key="preventiveMaintenance.id">
                                            <td nowrap>{{ convertDate(preventiveMaintenance.date_of_realization) }}</td>
                                            <td nowrap>{{ preventiveMaintenance.device.group.name }}</td>
                                            <td nowrap>{{ preventiveMaintenance.device.element.name + ' - ' + preventiveMaintenance.device.internal_code + ' - ' + preventiveMaintenance.device.serial_number }}</td>
                                            <td nowrap>{{ preventiveMaintenance.location.name }}</td>
                                            <td nowrap>{{ preventiveMaintenance.dependence.name }}</td>
                                            <td nowrap>{{ preventiveMaintenance.user.names }}</td>
                                            <td nowrap>
                                                <button class="btn btn-primary btn-sm mr-1" title="Evidencia" 
                                                    @click="showEvidence(preventiveMaintenance.evidence)">
                                                    <i class="fa fa-eye"></i>
                                                </button>
                                                <button class="btn btn-secondary btn-sm mr-1" title="Repuestos usados" 
                                                    v-if="preventiveMaintenance.replacement_maintenancables.length"
                                                    @click="showReplacements(preventiveMaintenance.replacement_maintenancables)">
                                                    <i class="fa fa-cogs"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--Otros mantenimientos-->
                            <div class="table-responsive" style="margin-top:15px" v-if="typeMaintenanceSelected == 2">
                                <table class="table table-hover table-sm">
                                    <thead>
                                        <th>Fecha</th>
                                        <th>Grupo</th>
                                        <th>Dispositivo</th>
                                        <th>Ubicación</th>
                                        <th>Dependencia</th>
                                        <th>Clasificación</th>
                                        <th>Usuario</th>
                                        <th></th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="otherMaintenance in maintenances.data" :key="otherMaintenance.id">
                                            <td nowrap>{{ convertDate(otherMaintenance.date_of_realization) }}</td>
                                            <td nowrap>{{ otherMaintenance.device.group.name }}</td>
                                            <td nowrap>{{ otherMaintenance.device.element.name + ' - ' + otherMaintenance.device.internal_code + ' - ' + otherMaintenance.device.serial_number }}</td>
                                            <td nowrap>{{ otherMaintenance.location.name }}</td>
                                            <td nowrap>{{ otherMaintenance.dependence.name }}</td>
                                            <td nowrap>{{ otherMaintenance.type_other_maintenance.name }}</td>
                                            <td nowrap>{{ otherMaintenance.user.names }}</td>
                                            <td nowrap>
                                                <button class="btn btn-primary btn-sm mr-1" title="Evidencia" 
                                                    @click="showEvidence(otherMaintenance.evidence)">
                                                    <i class="fa fa-eye"></i>
                                                </button>
                                                <button class="btn btn-secondary btn-sm mr-1" title="Repuestos usados" 
                                                    v-if="otherMaintenance.replacement_maintenancables.length"
                                                    @click="showReplacements(otherMaintenance.replacement_maintenancables)">
                                                    <i class="fa fa-cogs"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!--Mantenimientos generales-->
                            <div class="table-responsive" style="margin-top:15px" v-if="typeMaintenanceSelected == 3">
                                <table class="table table-hover table-sm">
                                    <thead>
                                        <th>Fecha</th>
                                        <th>Ubicación</th>
                                        <th>Dependencia</th>
                                        <th>Clasificación</th>
                                        <th>Usuario</th>
                                        <th></th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="otherMaintenance in maintenances.data" :key="otherMaintenance.id">
                                            <td nowrap>{{ convertDate(otherMaintenance.date_of_realization) }}</td>
                                            <td nowrap>{{ otherMaintenance.location.name }}</td>
                                            <td nowrap>{{ otherMaintenance.dependence.name }}</td>
                                            <td nowrap>{{ otherMaintenance.type_other_maintenance.name }}</td>
                                            <td nowrap>{{ otherMaintenance.user.names }}</td>
                                            <td nowrap>
                                                <button class="btn btn-primary btn-sm mr-1" title="Evidencia" 
                                                    @click="showEvidence(otherMaintenance.evidence)">
                                                    <i class="fa fa-eye"></i>
                                                </button>
                                                <button class="btn btn-secondary btn-sm mr-1" title="Repuestos usados" 
                                                    v-if="otherMaintenance.replacement_maintenancables.length"
                                                    @click="showReplacements(otherMaintenance.replacement_maintenancables)">
                                                    <i class="fa fa-cogs"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <pagination :data="maintenances" @pagination-change-page="getMaintenances"></pagination>
                            <!-- Modal replacenets -->
                            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">Repuestos usados</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="table-responsive">
                                            <table class="table table-hover table-sm">
                                                <thead>
                                                    <th>Repuesto</th>
                                                    <th>Cantidad</th>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="replacement in replacements" :key="`replacement-from-other-otherMaintenance-${ replacement.id }`">
                                                        <td>{{ replacement.replacement.name }}</td>
                                                        <td>{{ replacement.quantity }}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import { VueLoading } from 'vue-loading-template'
    import ModalFullHeight from '../components/ModalFullHeight'
    import download from 'downloadjs'
    export default {
        name: 'reports.maintenances.index',
        components: {
            VueLoading, 'modal-full-height': ModalFullHeight
        },
        created () {
            this.getUsersTechnicalSupportAndGroups()
        },
        data() {
            return {
                parameters: {
                    initial_date: '',
                    final_date: '',
                    user: '',
                    group: '',
                },
                initial_date_selected: '',
                final_date_selected: '',
                user_selected: '',
                users: [],
                groups: [],
                maintenances: {},
                typeMaintenance: "1",
                typeMaintenanceSelected: "1",
                replacements: [],
                downloadingPdf: false,
                downloadingExcel: false,
                evidence: '',
                loading: false
            }
        },
        methods: {
            getUsersTechnicalSupportAndGroups () {
                this.$http.get('reports/get-users-technical-support-and-groups').then( response => {                        
                    this.users = response.data.users
                    this.groups = response.data.groups
                    console.log(this.groups);
                })
            },
            getMaintenances (page = 1) {

                if (this.typeMaintenance != 3) {
                    if (!this.parameters.group) {
                        return this.$toastr.error('Seleccione el grupo')
                    }

                }

                this.loading = true
                this.maintenances = []
                this.typeMaintenanceSelected = this.typeMaintenance
                this.initial_date_selected = this.parameters.initial_date
                this.final_date_selected = this.parameters.final_date
                this.user_selected = this.parameters.user
                this.group_selected = this.parameters.group

                let URI = `reports/maintenances?page=${ page }&initial_date=${ this.initial_date_selected }
                            &final_date=${ this.final_date_selected }
                            &type_maintenance=${ this.typeMaintenanceSelected }
                            &group=${ this.group_selected }
                            &user_selected=${ this.user_selected }`
                this.$http.get(URI)
                    .then( response => {                        
                    if (response.data.total == 0) {
                        this.$toastr.info('No hay registros')
                    }
                    this.maintenances = response.data
                    this.loading = false
                }).catch(error => {
                    this.loading = false
                    if (error.response.status == 422) {
                        this.$toastr.error(error.response.data.errors.message[0])
                    }
                })
            },
            showEvidence (evidence) {
                this.evidence = `${this.$serverFiles}/${ evidence }`
                $('#modalFullHeight').modal('show')
            },
            exportReportExcel () {
                this.downloadingExcel = true
                this.$http.get(`reports/maintenances-export-excel?initial_date=${ this.initial_date_selected }
                                                                            &final_date=${ this.final_date_selected }
                                                                            &user_selected=${ this.user_selected }
                                                                            &type_maintenance=${ this.typeMaintenanceSelected }
                                                                            &group=${ this.group_selected }`, 
                                                                            { responseType: 'blob' })
                    .then( response => {
                    download(response.data, "Reporte-de-mantenimientos.xlsx", "blob");
                    this.downloadingExcel = false
                    this.$toastr.success('Reporte excel descargado')
                }).catch(error => {
                    this.downloadingExcel = false
                    this.$toastr.error('Error al descargar el reporte')
                    if (error.response.status == 422) {
                        this.$toastr.error('El usuario no está autorizado en el grupo seleccionado')
                    }
                })
            },
            exportReportPdf () {
                this.downloadingPdf = true
                this.$http.get(`reports/maintenances-export-pdf?initial_date=${ this.initial_date_selected }
                                                                &final_date=${ this.final_date_selected }
                                                                &user_selected=${ this.user_selected }
                                                                &type_maintenance=${ this.typeMaintenanceSelected }
                                                                &group=${ this.group_selected }`, 
                                                                { responseType: 'blob' })
                    .then( response => {
                    download(response.data, "Reporte-de-mantenimientos.pdf", "blob");
                    this.downloadingPdf = false
                    this.$toastr.success('Reporte pdf descargado')
                }).catch(error => {
                    this.downloadingPdf = false
                    this.$toastr.error('Error al descargar el reporte')
                    if (error.response.status == 422) {
                        this.$toastr.error('El usuario no está autorizado en el grupo seleccionado')
                    }
                })
            },
            showReplacements (replacements) {
                this.replacements = replacements
                $('#exampleModal').modal('show')
            },
            convertDate (date) {
                return this.$moment(date).format('DD[-]MMMM[-]Y')
            }
        },
        watch: {
            typeMaintenance(newValue, oldValue) {
                if (newValue == 3) {
                    this.parameters.group = ""
                }
            }
        },
    }
</script>