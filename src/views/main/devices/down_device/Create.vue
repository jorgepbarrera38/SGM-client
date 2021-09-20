<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        Dar baja al dispositivo
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="save">
                            <div class="alert alert-danger" v-show="Object.keys(errors).length > 0 ? true : false">
                                <li v-for="(error, index) in errors" :key="index">
                                    {{ error[0] }}
                                </li>
                            </div>

                            <div class="form-group">
                                <label for="">Fecha</label>
                                <input type="date" class="form-control" v-model="down.down_date">
                            </div>
                            <div class="form-group">
                                <label for="">Motivo</label>
                                <input type="text" class="form-control" v-model="down.down_reason" maxlength="150">
                            </div>
                            
                            <div class="form-group">
                                <label for="">Evidencia (pdf máximo 25MB)</label>
                                <input type="file" class="form-control" @change="setFileInModel">
                            </div>

                            <vue-loading v-if="saving" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                            <div v-else>
                                <button type="submit" class="btn btn-primary btn-sm mr-1"><i class="fa fa-save"></i> Guardar</button>
                                <a href="#" class="btn btn-danger btn-sm" @click.prevent="$router.go(-1)"><i class="fa fa-times-circle"></i> Cancelar</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { VueLoading } from 'vue-loading-template'
    export default {
        name: 'devices.other-maintenances.create',
        components: {
            VueLoading
        },
        data() {
            return {
                down: {
                    down_date: '',
                    down_reason: '',
                    down_evidence: ''
                },
                saving: false,
                errors: {}
            }
        },
        methods: {
            save () {
                this.saving = true

                let data = new FormData

                data.append('down_date', this.down.down_date)
                data.append('down_reason', this.down.down_reason)
                data.append('down_evidence', this.down.down_evidence)

                this.$http.post(`devices/${ this.$route.params.id }/down`, data).then( response => {
                    this.saving = false
                    this.$toastr.success('El dispositivo se dió de baja')
                    this.$router.push({ name: 'devices.index' })
                }).catch(error => {
                    this.saving = false
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
                })
            },
            setFileInModel (e) {
                this.down.down_evidence = e.target.files[0]
            }
        },
    }
</script>