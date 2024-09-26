import { Component, OnInit } from '@angular/core';
import { CoresBackgroundTipo } from '../../models/cores-background-tipo';
import { PokeApiService } from '../../services/poke-api.service';
import { converterParaTitleCase } from '../../utill/converter-para-title-case';
import { TipoPokemon } from '../../models/tipo-pokemon';
import { Pokemon } from '../../models/pokemon';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { mapearTipoPokemon } from '../../utill/mapear-tipo-pokemon';
import { CardPokemonComponent } from "./card-pokemon/card-pokemon.component";
import { BuscaComponent } from "../busca/busca.component";

@Component({
  selector: 'app-listagem',
  standalone: true,
  imports: [NgClass, NgIf, NgForOf, RouterLink, CardPokemonComponent, BuscaComponent],
  templateUrl: './listagem.component.html',
})
export class ListagemComponent implements OnInit {
  public pokemons: Pokemon[];


  private offsetPaginacao: number;

  public buscaRealizada: boolean = false;

  constructor(private pokeApiService: PokeApiService) {
    this.pokemons = [];
    this.offsetPaginacao = 0;
  }

  public ngOnInit(): void {
    this.obterPokemons();
  }

  public buscarMaisResultados(): void{

    this.offsetPaginacao += 20;

    this.obterPokemons();
  }

  public filtrarPokemons(textoFiltro: string): void{
    this.buscaRealizada = true;

    this.pokemons = this.pokemons.filter((p) => {
      return p.nome.toLowerCase().includes(textoFiltro.toLowerCase());
    });
  }

  public limparFiltro(){
    this.buscaRealizada = false;
    this.pokemons = [];
    this.obterPokemons();
  }

  private obterPokemons() {
    this.pokeApiService.selecionarTodos(this.offsetPaginacao).subscribe((res) => {
      const arrayResultados = res.results as any[];

      for (let resultado of arrayResultados) {
        this.pokeApiService
          .selecionarDetalhesPorUrl(resultado.url)
          .subscribe((objDetalhes: any) => {
            const pokemon = this.mapearPokemon(objDetalhes);

            this.pokemons.push(pokemon);
          });
      }

      this.pokemons.sort((p) => p.id);
    });
  }



  private mapearPokemon(obj: any): Pokemon {
    return {
      id: obj.id,
      nome: converterParaTitleCase(obj.name),
      urlSprite: obj.sprites.other.dream_world.front_default,
      tipos: obj.types.map(mapearTipoPokemon),
    };
  }



}
