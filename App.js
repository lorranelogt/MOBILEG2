import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
  Modal,
  Platform,
} from 'react-native';
import { PROGRAMAS, CORES_BOTOES, IMAGENS_PAGINAS } from './dadosLivro';

const ESTILOS_ALTERNATIVAS = [
  { id: 0, forma: '▲', bg: '#E21B3C', borda: '#990F26', brilho: '#FF526F' },
  { id: 1, forma: '◆', bg: '#E0A100', borda: '#996E00', brilho: '#FFC42E' },
  { id: 2, forma: '●', bg: '#1368CE', borda: '#0A4285', brilho: '#4294F7' },
  { id: 3, forma: '■', bg: '#26890C', borda: '#165206', brilho: '#47B828' },
];

const TEMAS_CARDS = [
  { cor: '#E21B3C', fundoIcone: '#FDE8EC', icone: '🐾' },
  { cor: '#1368CE', fundoIcone: '#E6F0FC', icone: '🎬' },
  { cor: '#26890C', fundoIcone: '#E8F5E5', icone: '🐕' },
  { cor: '#E0A100', fundoIcone: '#FDF6E2', icone: '🦴' },
  { cor: '#864CBF', fundoIcone: '#F3EBFA', icone: '🏆' },
];

export default function App() {
  const [tela, setTela] = useState('INICIO');
  const [programaAtual, setProgramaAtual] = useState(null);
  const [questoesSessao, setQuestoesSessao] = useState([]);

  const [indiceAtual, setIndiceAtual] = useState(0);
  const [tentativaAtual, setTentativaAtual] = useState(1);
  const [pontuacaoTotal, setPontuacaoTotal] = useState(0);
  const [acertosPrimeira, setAcertosPrimeira] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [bloqueado, setBloqueado] = useState(false);
  const [modalImagemVisivel, setModalImagemVisivel] = useState(false);

  const iniciarPrograma = (codigo) => {
    let listaQuestoes = [];
    let tituloPrograma = '';

    if (codigo === '136') {
      tituloPrograma = 'Programa 6 • Avaliação Geral';
      ['131', '132', '133', '134', '135'].forEach((cod) => {
        const prog = PROGRAMAS[cod];
        const sorteadas = [...prog.questoes]
          .sort(() => Math.random() - 0.5)
          .slice(0, 6);
        listaQuestoes.push(...sorteadas);
      });
    } else {
      const prog = PROGRAMAS[codigo];
      tituloPrograma = prog.titulo;
      listaQuestoes = prog.questoes;
    }

    setProgramaAtual({ codigo, titulo: tituloPrograma });
    setQuestoesSessao(listaQuestoes);
    setIndiceAtual(0);
    setTentativaAtual(1);
    setPontuacaoTotal(0);
    setAcertosPrimeira(0);
    setFeedback(null);
    setBloqueado(false);
    setModalImagemVisivel(false);
    setTela('JOGO');
  };

  const avancarQuestao = () => {
    if (indiceAtual + 1 < questoesSessao.length) {
      setIndiceAtual((prev) => prev + 1);
      setTentativaAtual(1);
      setFeedback(null);
      setBloqueado(false);
    } else {
      setTela('RESULTADO');
    }
  };

  const verificarResposta = (corId) => {
    if (bloqueado) return;

    const questao = questoesSessao[indiceAtual];
    const acertou = corId === questao.correta;

    if (acertou) {
      const pontosGanhos = tentativaAtual === 1 ? 3 : tentativaAtual === 2 ? 2 : 1;
      if (tentativaAtual === 1) {
        setAcertosPrimeira((prev) => prev + 1);
      }
      setPontuacaoTotal((prev) => prev + pontosGanhos);
      setFeedback({
        tipo: 'acerto',
        texto: `EXCELENTE! +${pontosGanhos} ${pontosGanhos === 1 ? 'PONTO' : 'PONTOS'}`,
      });
      setBloqueado(true);

      setTimeout(() => {
        avancarQuestao();
      }, 1000);
    } else {
      if (tentativaAtual < 3) {
        const proxima = tentativaAtual + 1;
        setTentativaAtual(proxima);
        setFeedback({
          tipo: 'erro',
          texto: `QUASE LÁ! TENTATIVA ${proxima} DE 3`,
        });
      } else {
        const textoCerta = questao.opcoes[questao.correta];
        const nomeCor = CORES_BOTOES[questao.correta].nome;
        setFeedback({
          tipo: 'fim_questao',
          texto: `RESPOSTA CERTA: ${textoCerta.toUpperCase()} (${nomeCor.toUpperCase()})`,
        });
        setBloqueado(true);

        setTimeout(() => {
          avancarQuestao();
        }, 1800);
      }
    }
  };

  const gerarSenhaDesafio = () => {
    const base = (pontuacaoTotal * 17 + Number(programaAtual.codigo)).toString(16).toUpperCase();
    return `PB-${base.padStart(4, '0')}`;
  };

  const obterNivelDesempenho = () => {
    if (pontuacaoTotal >= 75) return { titulo: 'MESTRE DOS DÁLMATAS', emoji: '👑', cor: '#26890C', borda: '#165206' };
    if (pontuacaoTotal >= 50) return { titulo: 'SUPER TREINADOR', emoji: '🌟', cor: '#1368CE', borda: '#0A4285' };
    if (pontuacaoTotal >= 25) return { titulo: 'BOM FARO CANINO', emoji: '🐾', cor: '#E0A100', borda: '#996E00' };
    return { titulo: 'FILHOTE APRENDIZ', emoji: '🐶', cor: '#E21B3C', borda: '#990F26' };
  };

  if (tela === 'INICIO') {
    return (
      <SafeAreaView style={styles.containerRoxo}>
        <StatusBar barStyle="light-content" backgroundColor="#320E6B" />

        <View style={styles.heroInicio}>
          <View style={styles.circuloDecorativo1} />
          <View style={styles.circuloDecorativo2} />

          <View style={styles.badgeTopoInicio}>
            <Text style={styles.textoBadgeTopo}>✨ TECTOY • 101 DÁLMATAS</Text>
          </View>

          <Text style={styles.tituloHero}>Pense Bem!</Text>
          <Text style={styles.subtituloHero}>
            Selecione um programa abaixo, consulte as páginas e conquiste a pontuação máxima
          </Text>

          <View style={styles.barraRegrasHero}>
            <View style={styles.itemRegra}>
              <Text style={styles.regraDestaque}>1ª</Text>
              <Text style={styles.regraTexto}>3 pts</Text>
            </View>
            <View style={styles.divisorRegra} />
            <View style={styles.itemRegra}>
              <Text style={styles.regraDestaque}>2ª</Text>
              <Text style={styles.regraTexto}>2 pts</Text>
            </View>
            <View style={styles.divisorRegra} />
            <View style={styles.itemRegra}>
              <Text style={styles.regraDestaque}>3ª</Text>
              <Text style={styles.regraTexto}>1 pt</Text>
            </View>
          </View>
        </View>

        <View style={styles.corpoBrancoArredondado}>
          <Text style={styles.tituloSecao}>PROGRAMAS DISPONÍVEIS</Text>

          <ScrollView
            contentContainerStyle={styles.listaProgramas}
            showsVerticalScrollIndicator={false}
          >
            {Object.keys(PROGRAMAS).map((codigo, index) => {
              const tema = TEMAS_CARDS[index % TEMAS_CARDS.length];

              return (
                <TouchableOpacity
                  key={codigo}
                  activeOpacity={0.85}
                  style={styles.cardProgramaNovo}
                  onPress={() => iniciarPrograma(codigo)}
                >
                  <View style={[styles.boxIconePrograma, { backgroundColor: tema.fundoIcone }]}>
                    <Text style={styles.emojiPrograma}>{tema.icone}</Text>
                  </View>

                  <View style={styles.infoProgramaNovo}>
                    <View style={styles.linhaMetaPrograma}>
                      <View style={[styles.pillCodigo, { backgroundColor: tema.cor }]}>
                        <Text style={styles.textoPillCodigo}>PROG. {codigo}</Text>
                      </View>
                      <Text style={styles.textoQtdQuestoes}>30 perguntas</Text>
                    </View>

                    <Text style={styles.tituloProgramaNovo} numberOfLines={2}>
                      {PROGRAMAS[codigo].titulo}
                    </Text>

                    <Text style={styles.teclasProgramaNovo}>
                      ⌨ {PROGRAMAS[codigo].codigo}
                    </Text>
                  </View>

                  <View style={[styles.botaoPlayRedondo, { backgroundColor: tema.cor }]}>
                    <Text style={styles.setaPlay}>▶</Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.cardDesafioEspecial}
              onPress={() => iniciarPrograma('136')}
            >
              <View style={styles.boxIconeEspecial}>
                <Text style={styles.emojiPrograma}>🔥</Text>
              </View>

              <View style={styles.infoProgramaNovo}>
                <View style={styles.linhaMetaPrograma}>
                  <View style={styles.pillCodigoEspecial}>
                    <Text style={styles.textoPillCodigoEspecial}>DESAFIO 136</Text>
                  </View>
                  <Text style={styles.textoQtdEspecial}>Modo Aleatório</Text>
                </View>

                <Text style={styles.tituloProgramaEspecial}>
                  Programa 6 • Avaliação Geral
                </Text>

                <Text style={styles.teclasProgramaEspecial}>
                  6 questões sorteadas de cada programa
                </Text>
              </View>

              <View style={styles.botaoPlayEspecial}>
                <Text style={styles.setaPlayEspecial}>★</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  if (tela === 'JOGO') {
    const questaoAtual = questoesSessao[indiceAtual];
    const progressoPercentual = ((indiceAtual + 1) / 30) * 100;
    const pontosValendo = tentativaAtual === 1 ? 3 : tentativaAtual === 2 ? 2 : 1;
    const imagemPagina = IMAGENS_PAGINAS[questaoAtual.pagNum];

    return (
      <SafeAreaView style={styles.containerJogo}>
        <StatusBar barStyle="light-content" backgroundColor="#320E6B" />

        <Modal
          visible={modalImagemVisivel}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalImagemVisivel(false)}
        >
          <View style={styles.modalFundo}>
            <View style={styles.modalTopo}>
              <View style={styles.modalBadgePagina}>
                <Text style={styles.modalTitulo}>
                  📖 {questaoAtual.pag} • Questão {questaoAtual.num}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalImagemVisivel(false)}
                style={styles.modalBtnFechar}
              >
                <Text style={styles.modalTextoFechar}>FECHAR ✕</Text>
              </TouchableOpacity>
            </View>
            {imagemPagina && (
              <Image
                source={imagemPagina}
                style={styles.imagemModalCheia}
                resizeMode="contain"
              />
            )}
          </View>
        </Modal>

        <View style={styles.headerJogoNovo}>
          <TouchableOpacity onPress={() => setTela('INICIO')} style={styles.btnSairJogo}>
            <Text style={styles.textoBtnSair}>✕</Text>
          </TouchableOpacity>

          <View style={styles.centroHeaderJogo}>
            <View style={styles.trilhoProgressoNovo}>
              <View style={[styles.barraProgressoNovo, { width: `${progressoPercentual}%` }]} />
            </View>
            <Text style={styles.textoProgressoHeader}>
              QUESTÃO {indiceAtual + 1} DE 30
            </Text>
          </View>

          <View style={styles.badgePontosHeader}>
            <Text style={styles.emojiMoeda}>💎</Text>
            <Text style={styles.textoPontosHeader}>{pontuacaoTotal}</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollAreaJogo}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardPergunta3D}>
            <View style={styles.topoCardPergunta}>
              <View style={styles.seloPagina}>
                <Text style={styles.textoSeloPagina}>
                  📖 Q.{questaoAtual.num} • {questaoAtual.pag}
                </Text>
              </View>

              <View style={styles.grupoStatusDireita}>
                <View style={styles.seloTentativa}>
                  <Text style={styles.textoSeloTentativa}>
                    {tentativaAtual}ª/3 TENT.
                  </Text>
                </View>

                <View style={styles.seloValorPontos}>
                  <Text style={styles.textoSeloValor}>+{pontosValendo} PTS</Text>
                </View>
              </View>
            </View>

            {imagemPagina && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setModalImagemVisivel(true)}
                style={styles.molduraImagemPagina}
              >
                <Image
                  source={imagemPagina}
                  style={styles.imagemPaginaJogo}
                  resizeMode="contain"
                />
                <View style={styles.pillZoomFlutuante}>
                  <Text style={styles.textoPillZoom}>🔍 Ampliar página</Text>
                </View>
              </TouchableOpacity>
            )}

            <View style={styles.boxEnunciado}>
              <Text style={styles.textoEnunciadoNovo}>{questaoAtual.pergunta}</Text>
            </View>
          </View>

          {feedback && (
            <View
              style={[
                styles.toastFeedback,
                feedback.tipo === 'acerto'
                  ? styles.toastAcerto
                  : styles.toastErro,
              ]}
            >
              <Text style={styles.iconeToast}>
                {feedback.tipo === 'acerto' ? '🎉' : '⚠️'}
              </Text>
              <Text style={styles.textoToast}>{feedback.texto}</Text>
            </View>
          )}

          <View style={styles.listaAlternativas3D}>
            {questaoAtual.opcoes.map((textoOpcao, idx) => {
              const estiloAlt = ESTILOS_ALTERNATIVAS[idx];
              const corInfo = CORES_BOTOES[idx];

              return (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.85}
                  disabled={bloqueado}
                  onPress={() => verificarResposta(idx)}
                  style={[
                    styles.botaoAlternativa3D,
                    {
                      backgroundColor: estiloAlt.bg,
                      borderBottomColor: estiloAlt.borda,
                      borderTopColor: estiloAlt.brilho,
                    },
                    bloqueado && styles.botaoAlternativaDesabilitado,
                  ]}
                >
                  <View style={styles.emblemaForma}>
                    <Text style={styles.simboloForma}>{estiloAlt.forma}</Text>
                  </View>

                  <View style={styles.colunaTextoAlternativa}>
                    <Text style={styles.textoAlternativaPrincipal}>{textoOpcao}</Text>
                    <Text style={styles.etiquetaCorAlternativa}>
                      TECLA {corInfo.nome.toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.indicadorToque}>
                    <Text style={styles.setaToque}>›</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const nivel = obterNivelDesempenho();
  const aproveitamento = Math.round((pontuacaoTotal / 90) * 100);

  return (
    <SafeAreaView style={styles.containerRoxo}>
      <StatusBar barStyle="light-content" backgroundColor="#320E6B" />

      <ScrollView contentContainerStyle={styles.scrollResultado}>
        <View style={styles.circuloDecorativo1} />

        <View style={styles.emblemaTrofeu}>
          <Text style={styles.emojiTrofeu}>{nivel.emoji}</Text>
        </View>

        <Text style={styles.tituloResultado}>Programa Concluído!</Text>
        <Text style={styles.subtituloResultado}>{programaAtual.titulo}</Text>

        <View style={styles.cardPodio3D}>
          <View
            style={[
              styles.bannerNivelPodio,
              { backgroundColor: nivel.cor, borderBottomColor: nivel.borda },
            ]}
          >
            <Text style={styles.textoBannerNivel}>{nivel.titulo}</Text>
          </View>

          <Text style={styles.labelPlacarFinal}>PONTUAÇÃO TOTAL</Text>
          <View style={styles.linhaNumeroPontos}>
            <Text style={styles.numeroGigantePontos}>{pontuacaoTotal}</Text>
            <Text style={styles.barraNoventa}>/90</Text>
          </View>

          <View style={styles.gridEstatisticas}>
            <View style={styles.boxEstatistica}>
              <Text style={styles.valorEstatistica}>{acertosPrimeira}</Text>
              <Text style={styles.labelEstatistica}>De 1ª</Text>
            </View>

            <View style={styles.divisorVerticalEstat} />

            <View style={styles.boxEstatistica}>
              <Text style={styles.valorEstatistica}>{aproveitamento}%</Text>
              <Text style={styles.labelEstatistica}>Precisão</Text>
            </View>

            <View style={styles.divisorVerticalEstat} />

            <View style={styles.boxEstatistica}>
              <Text style={styles.valorEstatistica}>30</Text>
              <Text style={styles.labelEstatistica}>Questões</Text>
            </View>
          </View>

          <View style={styles.ticketSenhaDesafio}>
            <Text style={styles.tituloTicketSenha}>🎟️ SENHA NOTA DESAFIO</Text>
            <Text style={styles.codigoTicketSenha}>{gerarSenhaDesafio()}</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.botaoJogarNovamente3D}
          onPress={() => iniciarPrograma(programaAtual.codigo)}
        >
          <Text style={styles.textoBotaoJogarNovamente}>JOGAR NOVAMENTE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.botaoMenuPrincipal}
          onPress={() => setTela('INICIO')}
        >
          <Text style={styles.textoBotaoMenuPrincipal}>ESCOLHER OUTRO PROGRAMA</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerRoxo: {
    flex: 1,
    backgroundColor: '#3B127A',
  },
  containerJogo: {
    flex: 1,
    backgroundColor: '#EEF1F6',
  },

  heroInicio: {
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'android' ? 28 : 18,
    paddingBottom: 26,
    alignItems: 'center',
    overflow: 'hidden',
  },
  circuloDecorativo1: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    top: -70,
    right: -60,
  },
  circuloDecorativo2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 214, 0, 0.07)',
    bottom: -40,
    left: -50,
  },
  badgeTopoInicio: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 10,
  },
  textoBadgeTopo: {
    color: '#FFD600',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  tituloHero: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subtituloHero: {
    fontSize: 13,
    color: '#D8C8F5',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19,
    maxWidth: 320,
  },
  barraRegrasHero: {
    flexDirection: 'row',
    backgroundColor: 'rgba(20, 5, 46, 0.45)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  itemRegra: {
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  regraDestaque: {
    color: '#FFD600',
    fontSize: 13,
    fontWeight: '900',
  },
  regraTexto: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  divisorRegra: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },

  corpoBrancoArredondado: {
    flex: 1,
    backgroundColor: '#F4F6FA',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
  },
  tituloSecao: {
    fontSize: 12,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 1.2,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  listaProgramas: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  cardProgramaNovo: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  boxIconePrograma: {
    width: 54,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  emojiPrograma: {
    fontSize: 26,
  },
  infoProgramaNovo: {
    flex: 1,
    paddingRight: 8,
  },
  linhaMetaPrograma: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5,
  },
  pillCodigo: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  textoPillCodigo: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  textoQtdQuestoes: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  tituloProgramaNovo: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    lineHeight: 20,
  },
  teclasProgramaNovo: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 4,
  },
  botaoPlayRedondo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  setaPlay: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    marginLeft: 2,
  },

  cardDesafioEspecial: {
    flexDirection: 'row',
    backgroundColor: '#1E1B4B',
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FF6F00',
    borderBottomWidth: 5,
    borderBottomColor: '#B34D00',
    marginTop: 4,
    elevation: 5,
  },
  boxIconeEspecial: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 111, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  pillCodigoEspecial: {
    backgroundColor: '#FF6F00',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  textoPillCodigoEspecial: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  textoQtdEspecial: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FDBA74',
  },
  tituloProgramaEspecial: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  teclasProgramaEspecial: {
    fontSize: 11,
    fontWeight: '600',
    color: '#C7D2FE',
    marginTop: 4,
  },
  botaoPlayEspecial: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD600',
    justifyContent: 'center',
    alignItems: 'center',
  },
  setaPlayEspecial: {
    color: '#1E1B4B',
    fontSize: 18,
    fontWeight: '900',
  },

  headerJogoNovo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B127A',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 14 : 10,
    paddingBottom: 14,
    gap: 12,
  },
  btnSairJogo: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBtnSair: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  centroHeaderJogo: {
    flex: 1,
    alignItems: 'center',
  },
  trilhoProgressoNovo: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  barraProgressoNovo: {
    height: 10,
    backgroundColor: '#4ADE80',
    borderRadius: 8,
  },
  textoProgressoHeader: {
    color: '#E9D5FF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 5,
  },
  badgePontosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22074A',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 0, 0.35)',
    gap: 4,
  },
  emojiMoeda: {
    fontSize: 13,
  },
  textoPontosHeader: {
    color: '#FFD600',
    fontSize: 15,
    fontWeight: '900',
  },

  scrollAreaJogo: {
    padding: 16,
    paddingBottom: 32,
  },
  cardPergunta3D: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 5,
    borderBottomColor: '#CBD5E1',
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  topoCardPergunta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 6,
  },
  seloPagina: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  textoSeloPagina: {
    color: '#C2410C',
    fontSize: 12,
    fontWeight: '900',
  },
  grupoStatusDireita: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  seloTentativa: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  textoSeloTentativa: {
    color: '#6B21A8',
    fontSize: 11,
    fontWeight: '900',
  },
  seloValorPontos: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  textoSeloValor: {
    color: '#15803D',
    fontSize: 11,
    fontWeight: '900',
  },
  molduraImagemPagina: {
    width: '100%',
    height: 220,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagemPaginaJogo: {
    width: '100%',
    height: '100%',
  },
  pillZoomFlutuante: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  textoPillZoom: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  boxEnunciado: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  textoEnunciadoNovo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 26,
    textAlign: 'center',
  },

  toastFeedback: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 8,
    elevation: 4,
  },
  toastAcerto: {
    backgroundColor: '#16A34A',
    borderBottomWidth: 4,
    borderBottomColor: '#14532D',
  },
  toastErro: {
    backgroundColor: '#DC2626',
    borderBottomWidth: 4,
    borderBottomColor: '#7F1D1D',
  },
  iconeToast: {
    fontSize: 18,
  },
  textoToast: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.4,
    flexShrink: 1,
  },

  listaAlternativas3D: {
    gap: 11,
  },
  botaoAlternativa3D: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 70,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1.5,
    borderBottomWidth: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  botaoAlternativaDesabilitado: {
    opacity: 0.65,
  },
  emblemaForma: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  simboloForma: {
    fontSize: 22,
    color: '#FFFFFF',
  },
  colunaTextoAlternativa: {
    flex: 1,
  },
  textoAlternativaPrincipal: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  etiquetaCorAlternativa: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 3,
    letterSpacing: 1,
  },
  indicadorToque: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  setaToque: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginTop: -2,
  },

  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalTopo: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalBadgePagina: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  modalTitulo: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  modalBtnFechar: {
    backgroundColor: '#E21B3C',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#990F26',
  },
  modalTextoFechar: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
  },
  imagemModalCheia: {
    width: '100%',
    height: '82%',
  },

  scrollResultado: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emblemaTrofeu: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD600',
    marginBottom: 12,
  },
  emojiTrofeu: {
    fontSize: 42,
  },
  tituloResultado: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  subtituloResultado: {
    fontSize: 14,
    color: '#D8C8F5',
    marginTop: 4,
    marginBottom: 22,
    textAlign: 'center',
  },
  cardPodio3D: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 26,
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: 24,
    marginBottom: 22,
    borderBottomWidth: 6,
    borderBottomColor: '#CBD5E1',
    elevation: 8,
  },
  bannerNivelPodio: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 4,
    marginBottom: 18,
  },
  textoBannerNivel: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 1,
  },
  labelPlacarFinal: {
    fontSize: 11,
    fontWeight: '900',
    color: '#94A3B8',
    letterSpacing: 1.5,
  },
  linhaNumeroPontos: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 4,
  },
  numeroGigantePontos: {
    fontSize: 68,
    fontWeight: '900',
    color: '#3B127A',
    lineHeight: 76,
  },
  barraNoventa: {
    fontSize: 22,
    fontWeight: '800',
    color: '#94A3B8',
    marginLeft: 4,
  },
  gridEstatisticas: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '86%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  boxEstatistica: {
    alignItems: 'center',
  },
  valorEstatistica: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E293B',
  },
  labelEstatistica: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
  },
  divisorVerticalEstat: {
    width: 1,
    height: 26,
    backgroundColor: '#CBD5E1',
  },
  ticketSenhaDesafio: {
    backgroundColor: '#FFFBEB',
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderStyle: 'dashed',
  },
  tituloTicketSenha: {
    fontSize: 11,
    fontWeight: '900',
    color: '#B45309',
    letterSpacing: 1,
  },
  codigoTicketSenha: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1E293B',
    marginTop: 4,
    letterSpacing: 3,
  },
  botaoJogarNovamente3D: {
    backgroundColor: '#FFD600',
    width: '100%',
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 5,
    borderBottomColor: '#B39700',
  },
  textoBotaoJogarNovamente: {
    color: '#1E1B4B',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  botaoMenuPrincipal: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  textoBotaoMenuPrincipal: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});