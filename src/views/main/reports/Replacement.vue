<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Repuestos usados
                        </span>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="loading = true; getReplacements()">
                            <div class="form-row">
                                <div class="form-group col-md-3">
                                    <label for="">Fecha inicial</label>
                                    <input type="datetime-local" class="form-control" v-model="parameters.initial_date" required>
                                </div>
                                <div class="form-group col-md-3">
                                    <label for="">Fecha final</label>
                                    <input type="datetime-local" class="form-control" v-model="parameters.final_date" required>
                                </div>
                                <div class="form-group col-md-3">
                                    <label for="">Grupo</label>
                                    <select class="form-control" v-model="parameters.group" required>
                                        <option value="">Seleccione grupo</option>
                                        <option :value="group.id" v-for="group in groups" :key="group.id">{{ group.name }}</option>
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
                    </div>
                </div>
            </div>
            <vue-loading v-if="loading" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
            <div class="col-md-12 mt-3" v-if="!loading && Object.keys(replacements.data).length > 0">
                <div class="card">
                    <div class="card-header">
                        Resultados
                        <div class="float-right">
                            <button class="btn btn-success btn-sm mr-1" @click="exportReportExcel">
                                <div class="spinner-border spinner-border-sm" role="status" v-if="downloadingExcel">
                                    <span class="sr-only">Loading...</span>
                                </div>
                                <i class="fa fa-file-excel" v-else></i>
                                Exportar
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th nowrap>Fecha y hora inicio</th>
                                    <th nowrap>Fecha y hora fin</th>
                                    <th>Repuesto</th>
                                    <th>Cantidad</th>
                                    <th>Tipo</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="replacement in replacements.data" :key="replacement.id">
                                        <td nowrap>{{ convertDate(replacement.maintenance_date_of_realization) }}</td>
                                        <td nowrap>{{ convertDate(replacement.maintenance_date_of_realization_ending) }}</td>
                                        <td nowrap>{{ replacement.replacement_name }}</td>
                                        <td nowrap>{{ replacement.replacement_quantity }}</td>
                                        <td nowrap>
                                            <span v-if="replacement.type == 'preventive_maintenance'">
                                                Mantenimiento preventivo
                                            </span>
                                            <span v-if="replacement.type == 'other_maintenance'">
                                                Otro mantenimiento
                                            </span>
                                            <span v-if="replacement.type == 'general_maintenance'">
                                                Mantenimiento general
                                            </span>
                                        </td>
                                        <td nowrap>
                                            <button class="btn btn-primary btn-sm mr-1" title="Evidencia" :disabled="replacement.gettingEvidence"
                                                @click="showEvidence(replacement)">
                                                <div class="spinner-border spinner-border-sm" role="status" 
                                                    v-if="replacement.gettingEvidence">
                                                    <span class="sr-only">Loading...</span>
                                                </div>
                                                <i class="fa fa-eye" v-else></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="replacements" @pagination-change-page="getReplacements"></pagination>
                        <!-- Modal evidence -->
                        <modal-full-height :evidence="evidence" />
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
        name: 'reports.replacements.index',
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
                    group: '',
                },
                initial_date_selected: '',
                final_date_selected: '',
                group_selected: '',
                replacements: { data: [] },
                groups: [],
                loading: false,
                evidence: '',
                downloadingExcel: false
            }
        },
        methods: {
            getUsersTechnicalSupportAndGroups () {
                this.$http.get('reports/get-users-technical-support-and-groups').then( response => {                        
                    //this.users = response.data.users
                    this.groups = response.data.groups
                })
            },
            getReplacements (page = 1) {

                this.initial_date_selected = this.parameters.initial_date
                this.final_date_selected = this.parameters.final_date
                this.group_selected = this.parameters.group

                this.$http.get(`reports/replacements-used?page=${ page }&initial_date=${ this.initial_date_selected }&final_date=${ this.final_date_selected }&group=${ this.group_selected }`).then( response => {
                    this.replacements = response.data
                    response.data.data.forEach(maintenance => {
                        this.$set(maintenance, 'gettingEvidence', false)
                    })
                    
                    if (response.data && response.data.data.length < 1) {
                        this.$toastr.info('No hay registros')
                    }

                    this.loading = false
                })
            },
            showEvidence (replacement) {
                switch (replacement.type) {
                    case 'preventive_maintenance':
                        this.showEvidenceFromPreventiveMaintenance(replacement)
                        break;
                    case 'other_maintenance':
                        this.showEvidenceFromOtherMaintenance(replacement)
                        break;
                    case 'general_maintenance':
                        this.showEvidenceFromOtherMaintenance(replacement)
                        break;
                    default:
                        break;
                }
            },
            showEvidenceFromPreventiveMaintenance (maintenance) {
                maintenance.gettingEvidence = true
                this.$http.get(`preventive-maintenances/${ maintenance.maintenance_id }/get-evidence-from-preventive-maintenance`, { responseType: 'blob' }).then( response => {
                    const evidence = URL.createObjectURL(response.data)
                    this.evidence = evidence
                    $('#modalFullHeight').modal('show')
                    maintenance.gettingEvidence = false
                }).catch( errors => {
                    maintenance.gettingEvidence = false
                    this.$toastr.error('El archivo no se pudo generar')
                })
            },
            showEvidenceFromOtherMaintenance (maintenance) {
                maintenance.gettingEvidence = true
                this.$http.get(`other-maintenances/${ maintenance.maintenance_id }/get-evidence-from-other-maintenance`, { responseType: 'blob' }).then( response => {
                    const evidence = URL.createObjectURL(response.data)
                    this.evidence = evidence
                    $('#modalFullHeight').modal('show')
                    maintenance.gettingEvidence = false
                }).catch( errors => {
                    maintenance.gettingEvidence = false
                    this.$toastr.error('El archivo no se pudo generar')
                })
            },
            exportReportExcel () {
                this.downloadingExcel = true
                this.$http.get(`reports/replacements-used-excel?initial_date=${ this.initial_date_selected }&final_date=${ this.final_date_selected }&group=${ this.group_selected }`, { responseType: 'blob' })
                    .then( response => {
                    download(response.data, "Reporte-de-repuestos-usados.xlsx", "blob");
                    this.downloadingExcel = false
                    this.$toastr.success('Reporte excel descargado')
                }).catch(() => {
                    this.downloadingExcel = false
                    this.$toastr.error('Error al descargar el reporte')
                })
            },
            convertDate (date) {
                return this.$moment(date).format('DD[-]MMMM[-]Y HH[:]mm')
            }
        },
    }
</script>