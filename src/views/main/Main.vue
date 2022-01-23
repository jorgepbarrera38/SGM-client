<template>
    <div>
        <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
            <a class="navbar-brand" href="#">SGM {{ complementTitle ? ' - ' + complementTitle : '' }}</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="#" @click.prevent="$router.push({ name: 'main' })">Dashboard <span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Dispositivos
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <a :class="{ 'dropdown-item': true, disabled: !hasPermission('devices.index')}" href="#" @click.prevent="$router.push({ name: 'devices.index' })">Dispositivos</a>
                            <div class="dropdown-divider"></div>
                            <a :class="{ 'dropdown-item': true, disabled: !hasPermission('groups.index')}" href="#" @click.prevent="$router.push({ name: 'groups.index' })">Grupos</a>
                            <a :class="{ 'dropdown-item': true, disabled: !hasPermission('elements.index')}" href="#" @click.prevent="$router.push({ name: 'elements.index' })">Elementos</a>
                            <a :class="{ 'dropdown-item': true, disabled: !hasPermission('locations.index')}" href="#" @click.prevent="$router.push({ name: 'locations.index' })">Ubicaciónes</a>
                            <a :class="{ 'dropdown-item': true, disabled: !hasPermission('dependences.index')}" href="#" @click.prevent="$router.push({ name: 'dependences.index' })">Dependencias</a>
                            <a :class="{ 'dropdown-item': true, disabled: !hasPermission('responsibles.index')}" href="#" @click.prevent="$router.push({ name: 'responsibles.index' })">Responsables</a>
                            <a :class="{ 'dropdown-item': true, disabled: !hasPermission('brands.index')}" href="#" @click.prevent="$router.push({ name: 'brands.index' })">Marcas</a>
                            <a class="dropdown-item" href="#" @click.prevent="logout">Salir</a>
                        </div>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            General
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <a :class="{ 'dropdown-item': true, disabled: !hasPermission('devices.down.index')}" href="#" @click.prevent="$router.push({ name: 'down-devices.index' })">Dispositivos dados de baja</a>
                            <div class="dropdown-divider"></div>
                            <a :class="{ 'dropdown-item': true, disabled: !hasPermission('maintenances.create')}" href="#" @click.prevent="$router.push({ name: 'maintenances.create' })">Registrar mantenimiento general</a>
                            <div class="dropdown-divider"></div>
                            <a :class="{ 'dropdown-item': true, disabled: !hasPermission('type-documents.index')}" href="#" @click.prevent="$router.push({ name: 'typeDocuments.index' })">Tipos de documentos</a>
                            <a :class="{ 'dropdown-item': true, disabled: !hasPermission('type-other-maintenances.index')}" href="#" @click.prevent="$router.push({ name: 'type_other_maintenances.index' })">Clasificación de servicios</a>
                            <a :class="{ 'dropdown-item': true, disabled: !hasPermission('replacements.index')}" href="#" @click.prevent="$router.push({ name: 'replacements.index' })">Repuestos y consumibles</a>
                            <a :class="{ 'dropdown-item': true, disabled: !hasPermission('failure-modes.index')}" href="#" @click.prevent="$router.push({ name: 'failureModes.index' })">Modos de falla</a>
                            <div class="dropdown-divider"></div>
                            <a :class="{ 'dropdown-item': true, disabled: !hasPermission('periods.index')}" href="#" @click.prevent="$router.push({ name: 'periods.index' })">Periodos de mantenimiento</a>
                            <a :class="{ 'dropdown-item': true, disabled: !hasPermission('schedule-maintenance.index')}" href="#" @click.prevent="$router.push({ name: 'schedule_maintenance.index' })">Cronogramas de mantenimiento</a>
                            <div class="dropdown-divider"></div>
                            <a :class="{ 'dropdown-item': true, disabled: !hasPermission('company.index')}" href="#" @click.prevent="$router.push({ name: 'company.index' })">Empresa - Parámetros</a>
                            <div class="dropdown-divider"></div>
                            <a :class="{ 'dropdown-item': true, disabled: !hasPermission('users.index')}" href="#" @click.prevent="$router.push({ name: 'users.index' })">Usuarios</a>
                        </div>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Informes
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <a :class="{ 'dropdown-item': true, disabled: !hasPermission('reports.replacements')}" href="#" @click.prevent="$router.push({ name: 'reports.replacements' })">Repuestos usados</a>
                            <a :class="{ 'dropdown-item': true, disabled: !hasPermission('reports.maintenances')}" href="#" @click.prevent="$router.push({ name: 'reports.maintenances' })">Mantenimientos</a>                            
                            <!--<a class="dropdown-item disabled" href="#" @click.prevent="$router.push({ name: 'reports.maintenances' })">Dispositivos programados</a>-->
                        </div>
                    </li>
                </ul>
            </div>
            </nav>
        <router-view style="margin-top:80px"/>
    </div>
</template>

<script>
    import hasPermission from './_utilities/hasPermission'
    export default {
        mixins: [hasPermission],
        methods: {
            logout() {
                localStorage.removeItem('permissions')
                localStorage.removeItem('access_token')
                this.$router.push({ name: 'login' })
            }
        },
        computed: {
            complementTitle () {
                return localStorage.getItem('complementTitle')
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>