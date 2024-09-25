import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokeApiService } from '../../services/poke-api.service';
import { DetalhesPokemon } from '../../models/detalhes-pokemon';
import { converterParaTitleCase } from '../../utill/converter-para-title-case';
import { TipoPokemon } from '../../models/tipo-pokemon';
import { mapearTipoPokemon } from '../../utill/mapear-tipo-pokemon';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { CoresBackgroundTipo } from '../../models/cores-background-tipo';

@Component({
  selector: 'app-detalhes',
  standalone: true,
  imports: [NgIf, NgClass, NgForOf],
  templateUrl: './detalhes.component.html',
  styleUrl: './detalhes.component.scss'
})

export class DetalhesComponent implements OnInit {
  id?: number;
  detalhesPokemon?: DetalhesPokemon;

  public coresBackgroundTipo: CoresBackgroundTipo = {
    Normal: 'fundo-tipo-normal',
    Fire: 'fundo-tipo-fogo',
    Water: 'fundo-tipo-agua',
    Electric: 'fundo-tipo-eletrico',
    Ice: 'fundo-tipo-gelo',
    Grass: 'fundo-tipo-grama',
    Bug: 'fundo-tipo-inseto',
    Poison: 'fundo-tipo-veneno',
    Flying: 'fundo-tipo-voador',
    Ground: 'fundo-tipo-terra',
    Rock: 'fundo-tipo-pedra',
    Fighting: 'fundo-tipo-lutador',
    Psychic: 'fundo-tipo-psiquico',
    Ghost: 'fundo-tipo-fantasma',
    Dark: 'fundo-tipo-sombrio',
    Fairy: 'fundo-tipo-fada',
    Steel: 'fundo-tipo-aco',
  };

  constructor(private route: ActivatedRoute,
    private pokeApiService: PokeApiService
  ){

  }
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id']

    if(!this.id) return;

    this.pokeApiService.selecionarDetalhesPorId(this.id).
    subscribe((resDetalhes) => {


      this.detalhesPokemon = this.mapearDetalhesPokemon(resDetalhes);

      console.log(this.detalhesPokemon)
    });
  }
  private mapearDetalhesPokemon(obj: any): DetalhesPokemon {
    return {
      id: obj.id,
      nome: converterParaTitleCase(obj.name),
      sprites: [
        obj.sprites.back_default,
        obj.sprites.front_default,
        obj.sprites.back_shiny,
        obj.sprites.front_shiny,
        obj.sprites.other.dream_world.front_default,
],
      tipos: obj.types.map(mapearTipoPokemon),
      altura: obj.height * 10,
      peso: obj.weight / 10,
    };
  }






}
