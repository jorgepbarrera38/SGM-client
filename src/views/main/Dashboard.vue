<template>
    <div class="container">
        <div class="row">
            <div class="col-md-4">
                <div class="card btn" @click="hasPermission('devices.index') ? $router.push({ name: 'devices.index' }) : $toastr.error('No tienes permisos para esta acción')">
                    <div class="card-header">
                        <span class="panel-title">
                            <i class="fas fa-laptop-code"></i> Dispositivos
                        </span>
                    </div>
                    <div class="card-body">
                        <h1>{{ devicesQuantity }}</h1>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card btn" @click="hasPermission('dependences.index') ? $router.push({ name: 'dependences.index' }) : $toastr.error('No tienes permisos para esta acción')">
                    <div class="card-header">
                        <span class="panel-title">
                            <i class="fas fa-map-marker-alt"></i> Dependencias
                        </span>
                    </div>
                    <div class="card-body">
                        <h1>{{ dependencesQuantity }}</h1>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card btn" @click="hasPermission('responsibles.index') ? $router.push({ name: 'responsibles.index' }) : $toastr.error('No tienes permisos para esta acción')">
                    <div class="card-header">
                        <span class="panel-title">
                            <i class="fas fa-users"></i> Responsables
                        </span>
                    </div>
                    <div class="card-body">
                        <h1>{{ responsiblesQuantity }}</h1>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import hasPermission from './_utilities/hasPermission'
export default {
    created () {
        this.getQuantities()
    },
    mixins: [ hasPermission ],
    data() {
        return {
            devicesQuantity: '',
            dependencesQuantity: '',
            responsiblesQuantity: '',
        }
    },
    methods: {
        getQuantities() {
            this.$http.get('dashboard/get-quantities').then( response => {
                this.devicesQuantity = response.data.devicesQuantity
                this.dependencesQuantity = response.data.dependencesQuantity
                this.responsiblesQuantity = response.data.responsiblesQuantity
            })
        }
    },
}
</script>