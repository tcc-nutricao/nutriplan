<template>
  <div>
    <ProfileCardHorizontal />
    <div class="bg-white rounded-2xl shadow p-6 w-full max-w-4xl mx-auto mt-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-purple-700">Dados Pessoais</h2>
        <button
          class="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition font-medium"
        >
          Editar
        </button>
      </div>
      <div class="grid grid-cols-2 gap-6">
        <div>
          <p class="text-gray-600 text-sm">Idade</p>
          <p
            class="bg-purple-50 text-purple-800 font-semibold px-3 py-1 rounded-md inline-block"
          >
            15 anos
          </p>
        </div>

        <div>
          <p class="text-gray-600 text-sm">Sexo</p>
          <p
            class="bg-purple-50 text-purple-800 font-semibold px-3 py-1 rounded-md inline-block"
          >
            Feminino
          </p>
        </div>

        <div>
          <p class="text-gray-600 text-sm">Altura</p>
          <p
            class="bg-purple-50 text-purple-800 font-semibold px-3 py-1 rounded-md inline-block"
          >
            165 cm
          </p>
        </div>

        <div>
          <p class="text-gray-600 text-sm">Peso</p>
          <p
            class="bg-purple-50 text-purple-800 font-semibold px-3 py-1 rounded-md inline-block"
          >
            65 kg
          </p>
        </div>

        <div>
          <p class="text-gray-600 text-sm">Restrições Alimentares</p>
          <p
            class="bg-purple-50 text-purple-800 font-semibold px-3 py-1 rounded-md inline-block"
          >
            Informação
          </p>
        </div>

        <div>
          <p class="text-gray-600 text-sm">Objetivo</p>
          <p
            class="bg-purple-50 text-purple-800 font-semibold px-3 py-1 rounded-md inline-block"
          >
            Informação
          </p>
        </div>

        <div class="col-span-2">
          <p class="text-gray-600 text-sm">Preferências</p>
          <p
            class="bg-purple-50 text-purple-800 font-semibold px-3 py-1 rounded-md inline-block"
          >
            Informação
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
