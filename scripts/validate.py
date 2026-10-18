"""Buildless-site checks; no network, provider sends or WMS execution."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, urljoin
import json,re,subprocess,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parent.parent
ROUTES={'/':'index.html','/vision':'vision.html','/screens.html':'screens.html','/legal/privacy.html':'drafts/legal/privacy.html','/legal/terms.html':'legal/terms.html','/wms-cost':'drafts/wms-cost.html','/features/inventory-management':'drafts/features/inventory-management.html'}
class Doc(HTMLParser):
 def __init__(self):super().__init__();self.ids=set();self.links=[];self.h1=0;self.canonical=[];self.robots=[];self.ld=[];self.capture=False;self.buffer=''
 def handle_starttag(self,t,a):
  d=dict(a)
  if d.get('id'):assert d['id'] not in self.ids,('duplicate id',d['id']);self.ids.add(d['id'])
  if t=='h1':self.h1+=1
  if t in ['a','script','link','img']:
   u=d.get('href') or d.get('src')
   if u:self.links.append(u)
  if t=='link' and d.get('rel')=='canonical':self.canonical.append(d.get('href'))
  if t=='meta' and d.get('name')=='robots':self.robots.append(d.get('content'))
  if t=='script' and d.get('type')=='application/ld+json':self.capture=True;self.buffer=''
 def handle_data(self,x):
  if self.capture:self.buffer+=x
 def handle_endtag(self,t):
  if t=='script' and self.capture:self.ld.append(json.loads(self.buffer));self.capture=False
parsed={}
for route,file in ROUTES.items():
 d=Doc();d.feed((ROOT/file).read_text());parsed[route]=d;assert d.h1==1,(route,'H1');assert d.canonical==['https://quark.build'+route],(route,'canonical')
 if route in ['/wms-cost','/features/inventory-management']:
  assert d.robots==['noindex,follow'];assert len(d.ld)==1
  items=d.ld[0]['itemListElement'];assert [x['position']for x in items]==[1,2];assert items[-1]['item']=='https://quark.build'+route
for route,d in parsed.items():
 for ref in d.links:
  u=urlsplit(urljoin('https://quark.build'+route,ref))
  if u.scheme!='https' or u.netloc!='quark.build':continue
  if u.path in ROUTES:
   if u.fragment:assert u.fragment in parsed[u.path].ids,(route,ref,'fragment')
  else:
   rel='drafts/assets/'+u.path.removeprefix('/draft-assets/') if u.path.startswith('/draft-assets/') else u.path.lstrip('/')
   assert (ROOT/rel).is_file(),(route,ref,'missing file')
for file in ['index.html','vision.html','screens.html','robots.txt','sitemap.xml','vercel.json','legal/privacy.html']:
 base=subprocess.check_output(['git','show','4beba3c:'+file],cwd=ROOT);assert (ROOT/file).read_bytes()==base,(file,'unexpected change')
urls=[x.text for x in ET.parse(ROOT/'sitemap.xml').findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')];assert len(urls)==3
json.loads((ROOT/'vercel.json').read_text())
exclusions=(ROOT/'.vercelignore').read_text().splitlines()
assert all(x in exclusions for x in ['drafts','scripts','review-dist','docs','tests'])
for directory in ['assets','api','lib','scripts','drafts/assets','tests']:
 for f in (ROOT/directory).glob('*'):
  if f.suffix in ['.js','.cjs']:subprocess.run(['node','--check',str(f)],check=True)
for f in (ROOT/'docs/seo').glob('*.md'):
 for target in re.findall(r'\]\(([^)]+)\)',f.read_text()):
  if target.startswith(('http://','https://','#')):continue
  assert (f.parent/target.split('#')[0]).exists(),(f,target,'broken doc reference')
print('PASS: static HTML/JSON-LD/canonical/links, 3-URL sitemap, draft exclusion, JS syntax, preserved home/Vision/privacy/config and documentation links.')
