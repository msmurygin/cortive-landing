from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,urljoin
import subprocess,re,json,html
root=Path(__file__).resolve().parents[1];baseline='029347ae5c4c62a728c838c5d6930d0f7293eb3f'
def old(f):return subprocess.check_output(['git','-C',str(root),'show',baseline+':'+f]).decode()
checks=[]
def check(name,value):
 assert value,name
 checks.append(name)
class Page(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.refs=[];self.meta={};self.canonical=[];self.h1=0
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if 'id'in a:self.ids.append(a['id'])
  if t=='h1':self.h1+=1
  if t=='meta':
   key=a.get('name',a.get('property',''))
   check('metadata not duplicated '+key,key not in self.meta or not key)
   self.meta[key]=a.get('content','')
  if t=='link'and a.get('rel')=='canonical':self.canonical.append(a.get('href'))
  if t in ['a','script','link','img']:
   for k in ['href','src']:
    if k in a:self.refs.append(a[k])
pages=['index.html','product.html','vision.html','wms-cost.html','tools/wms-readiness-assessment/index.html','legal/privacy.html','legal/terms.html','thanks.html'];parsed={}
for f in pages:
 p=Page();text=(root/f).read_text();p.feed(text);parsed[f]=p;check('unique IDs '+f,len(p.ids)==len(set(p.ids)));check('single H1 '+f,p.h1==1)
 previous=Page();previous.feed(old(f));check('canonical unchanged '+f,p.canonical==previous.canonical);check('robots unchanged '+f,p.meta.get('robots')==previous.meta.get('robots'))
 for j in re.findall(r'<script[^>]*type=["\x27]application/ld\+json["\x27][^>]*>(.*?)</script>',text,re.S):json.loads(j)
 if f in pages[:5]:
  for key in ['description','og:title','og:description','twitter:title','twitter:description']:check('metadata present '+f+' '+key,bool(p.meta.get(key)))
  if f!='vision.html':check('no outdated maturity metadata '+f,not re.search(r'available build|capability scope|prototype|core.*concept',str(p.meta),re.I))
for f in ['robots.txt','sitemap.xml','api/lead.js','api/events.js','lib/lead-events.js','assets/leads.js','assessment-assets/assessment-model.js','assessment-assets/discovery-model.js','assessment-assets/assessment-pdf.js','assets/seo/cost-model.js','assets/seo/cost-ui.js']:
 check('preserved '+f,(root/f).read_text()==old(f))
config=json.loads(old('vercel.json'))
def resolve(route):
 for r in config['redirects']:
  if r['source']==route:route=r['destination'];break
 for r in config['rewrites']:
  if r['source']==route:route=r['destination'];break
 return route.lstrip('/')or'index.html'
refs=0
for f,p in parsed.items():
 for ref in p.refs:
  u=urlsplit(ref)
  if u.scheme or u.netloc:continue
  dest=resolve(urlsplit(urljoin('/'+f,ref)).path);check('reference '+f+' '+ref,(root/dest).is_file())
  if u.fragment:
   q=parsed.get(dest)or Page()
   if dest not in parsed:q.feed((root/dest).read_text())
   check('fragment '+f+' '+ref,u.fragment in q.ids)
  refs+=1
check('no remote demo requests',(not re.search(r'youtube(?:-nocookie)?\.com|ytimg.com|<iframe',(root/'product.html').read_text())))
report={'passed':True,'checks':len(checks),'references':refs,'baseline':baseline,'metadata':[{ 'file':f,'canonical':parsed[f].canonical,'metadata':parsed[f].meta}for f in pages[:5]]}
(root/'docs/stabilization/site-validation.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n');print(json.dumps({k:report[k]for k in ['passed','checks','references']}))
