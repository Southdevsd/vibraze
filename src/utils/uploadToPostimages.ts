// src/utils/uploadToPostimages.ts
// Função para fazer upload de imagem para o Postimages e retornar a URL permanente

export async function uploadToPostimages(file: File): Promise<string> {
    const formData = new FormData();
  formData.append('image', file);
  formData.append('key', 'c46c5c247761158551439532b1e5fc3c');

  const response = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData,
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    console.error('Erro ao parsear resposta do ImgBB:', e);
    throw new Error('Erro ao enviar imagem (resposta inválida)');
  }

  console.log('Resposta ImgBB:', data);
  if (!response.ok || !data || !data.data?.url) {
    throw new Error(data?.error?.message || 'Erro ao enviar imagem');
  }

  return data.data.url;
}